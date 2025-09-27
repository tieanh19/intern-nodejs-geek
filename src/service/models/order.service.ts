import { CreateOrderDto } from '../../dto/request/order.dto'
import { JwtPayloadDto } from '../../dto/request/auth.dto'
import prisma from '../utils/prisma.service'
import ApiError from '../../middleware/ApiError'
import { OrderInfos, Orders, OrderDetails } from '@prisma/client'
import vnpayService from '../../service/utils/vnpay.service'
import RabbitMQService from '../utils/rabbitmq.service'
import { QueueNameEnum } from '../../enums/emailType.enum'
import { NotificationDto, OrderConfirmationData } from '../../dto/request/notification.dto'

class OrderService {
    async createOrder( newOrder: CreateOrderDto, user: JwtPayloadDto, ipAddress: string ): Promise<
        { order: Orders, orderInfo: OrderInfos, orderDetails: OrderDetails[], payUri?: string | null }
    > {
        if (!newOrder.items || newOrder.items.length === 0)
            throw new ApiError(400, "Items không được để trống")

        // Use transaction for data consistency
        const result = await prisma.$transaction(async (tx) => {
            // 1. Validate and get product variants with their prices
            const productVariants = await Promise.all(newOrder.items!.map(async (item) => {
                const variant = await tx.productVariants.findUnique({
                    where: { id: item.productVariantId },
                    select: { quantity: true, price: true, id: true }
                })
                
                if (!variant) {
                    throw new ApiError(404, `Product variant với ID ${item.productVariantId} không tồn tại`)
                }
                
                if (variant.quantity < (item.quantity || 0)) {
                    throw new ApiError(400, `Product variant với ID ${item.productVariantId} không đủ hàng (còn ${variant.quantity}, yêu cầu ${item.quantity})`)
                }
                
                return variant
            }))

            // 2. Create order info (shipping information)
            const orderInfo = await tx.orderInfos.create({
                data: {
                    address: newOrder.receiverInfo?.address!,
                    receiver_name: newOrder.receiverInfo?.name!,
                    receiver_phone: newOrder.receiverInfo?.phone!,
                }
            })

            // 3. Create order
            const order = await tx.orders.create({
                data: {
                    customer_id: user.userId!,
                    payment_method: newOrder.paymentMethod!,
                    order_info_id: orderInfo.id,
                    status: 'PENDING'
                }
            })

            // 4. Create order details and reserve quantity for CASH payments
            const orderDetails = await Promise.all(
                newOrder.items!.map(async (item, index) => {
                    const orderDetail = await tx.orderDetails.create({
                        data: {
                            product_variant_id: item.productVariantId!,
                            order_id: order.id,
                            quantity: item.quantity!,
                            price: productVariants[index].price
                        }
                    })

                    // For CASH payments, immediately reduce inventory
                    // For VNPAY, inventory will be reduced after successful payment
                    if (newOrder.paymentMethod === 'CASH') {
                        await tx.productVariants.update({
                            where: { id: item.productVariantId },
                            data: {
                                quantity: {
                                    decrement: item.quantity!
                                }
                            }
                        })
                    }

                    return orderDetail
                })
            )

            // 5. Generate VNPAY payment URL if needed
            let payUri: { payUrl: string } | null = null
            if (newOrder.paymentMethod === 'VNPAY') {
                const amount = orderDetails.reduce((sum, item) => sum + item.price * item.quantity, 0)
                payUri = await vnpayService.createPayment({
                    amount,
                    orderId: order.id,
                    ipAddr: ipAddress || '127.0.0.1'
                })
            }

            return { order, orderInfo, orderDetails, payUri: payUri ? payUri.payUrl : null }
        })

        return result
    }

    async verifyPayment(query: any): Promise<{ isSuccess: boolean, orderId: string, rawData: any, message: string, rspCode?: string }> {
        const { orderId, amount, status, isValid } = vnpayService.getCallbackInfo(query)

        // 1. Validate VNPAY checksum
        if (!isValid) {
            return {
                isSuccess: false,
                orderId: orderId || '',
                rawData: query,
                message: 'Chữ ký không hợp lệ',
                rspCode: '97'
            }
        }

        // 2. Check if order exists
        const order = await this.getOrderById(orderId)

        // 4. Check VNPAY payment status
        if (status !== '00') {
            return {
                isSuccess: false,
                orderId: orderId || '',
                rawData: query,
                message: 'Thanh toán thất bại',
                rspCode: status
            }
        }

        // 5. Check if order already processed
        if (order.order.status === 'COMPLETED') {
            return {
                isSuccess: true, // Return success for idempotency
                orderId: orderId,
                rawData: query,
                message: 'Đơn hàng đã được xử lý thành công trước đó',
                rspCode: '00'
            }
        }

        // 6. Process payment confirmation with transaction
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // Reduce inventory for VNPAY payments
            await Promise.all(order.orderDetails.map(async (item) => {
                await tx.productVariants.update({
                    where: { id: item.product_variant_id },
                    data: {
                        quantity: {
                            decrement: item.quantity
                        }
                    }
                })
            }))

            // Update order status to completed
            return await tx.orders.update({
                where: { id: orderId },
                data: { status: 'COMPLETED' }
            })
        })

        // send confirmation email (omitted for brevity)
        await RabbitMQService.sendMessage({
            type: QueueNameEnum.ORDER_CONFIRMATION,
            email: [order.customer.email],
            title: `Xác nhận đơn hàng #${updatedOrder.id}`,
            orderId: order.order.id,
            customerName: order.customer.name,
            orderDate: order.order.create_at,
            items: order.orderDetails.map(od => ({
                productName: od.productVariant?.product.name,
                quantity: od.quantity,
            }))
        } as NotificationDto, QueueNameEnum.ORDER_CONFIRMATION)


        return {
            isSuccess: true,
            orderId: updatedOrder.id,
            rawData: query,
            message: 'Thanh toán thành công'
        }
    }

    // get order details by id
    async getOrderById(orderId: string): Promise<{ 
        order: Orders, 
        orderInfo: OrderInfos, 
        orderDetails: Array<OrderDetails & {
            productVariant: {
                product: {
                    name: string
                }
            }
        }>, 
        customer: { 
            id: string, 
            name: string, 
            email: string, 
            username: string 
        } 
    }> {
        const order = await prisma.orders.findUnique({ 
            where: { id: orderId },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true
                    }
                },
                details: {
                    include: {
                        productVariant: {
                            include: {
                                product: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                orderInfo: true
            }
        })

        if (!order) {
            throw new ApiError(404, 'Không tìm thấy đơn hàng')
        }

        return {
            order: order,
            orderInfo: order.orderInfo!,
            orderDetails: order.details!,
            customer: order.customer!,
        }
    }
}

export default new OrderService();