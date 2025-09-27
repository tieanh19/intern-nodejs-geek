import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    users.push(await prisma.users.create({
      data: {
        username: `user${i}`,
        password: await bcrypt.hash(`password${i}`, 10),
        name: `User ${i}`,
      },
    }));
  }

  // UserAddress
  for (let i = 1; i <= 10; i++) {
    await prisma.userAddress.create({
      data: {
        province: `Province ${i}`,
        district: `District ${i}`,
        ward: `Ward ${i}`,
        user_name: `Receiver ${i}`,
        user_phone: `012345678${i}`,
        user_id: users[(i-1)%10].id,
        is_default: i % 2 === 0,
      },
    });
  }

  // StoreBranches
  for (let i = 1; i <= 10; i++) {
    await prisma.storeBranches.create({
      data: {
        name: `Branch ${i}`,
        phone: `098765432${i}`,
        address: `Branch Address ${i}`,
      },
    });
  }

  // Categories
  const categories = [];
  for (let i = 1; i <= 10; i++) {
    categories.push(await prisma.categories.create({
      data: {
        imageUri: `https://picsum.photos/200/200?cat=${i}`,
        name: `Category ${i}`,
        description: `Description for category ${i}`,
      },
    }));
  }

  // Products
  const products = [];
  for (let i = 1; i <= 10; i++) {
    products.push(await prisma.products.create({
      data: {
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        category_id: categories[(i-1)%10].id,
        coverImg: `https://picsum.photos/300/300?prod=${i}`,
      },
    }));
  }

  // ProductVariants
  const variants = [];
  for (let i = 1; i <= 10; i++) {
    variants.push(await prisma.productVariants.create({
      data: {
        productId: products[(i-1)%10].id,
        size: `Size ${i}`,
        color: `Color ${i}`,
        imageUri: `https://picsum.photos/100/100?var=${i}`,
        price: 10000 + i * 1000,
        quantity: 10 + i,
        discount_percentage: i % 3 === 0 ? 10 : 0,
      },
    }));
  }

  // Cart
  const carts = [];
  for (let i = 1; i <= 10; i++) {
    carts.push(await prisma.cart.create({
      data: {
        user_id: users[(i-1)%10].id,
      },
    }));
  }

  // CartItems
  for (let i = 1; i <= 10; i++) {
    await prisma.cartItems.create({
      data: {
        product_variant_id: variants[(i-1)%10].id,
        quantity: i,
        cartId: carts[(i-1)%10].id,
      },
    });
  }

  // OrderInfos
  const orderInfos = [];
  for (let i = 1; i <= 10; i++) {
    orderInfos.push(await prisma.orderInfos.create({
      data: {
        address: `Order Address ${i}`,
        receiver_name: `Receiver ${i}`,
        receiver_phone: `099999999${i}`,
      },
    }));
  }

  // Orders
  const orders = [];
  for (let i = 1; i <= 10; i++) {
    orders.push(await prisma.orders.create({
      data: {
        customer_id: users[(i-1)%10].id,
        payment_method: i % 2 === 0 ? 'VNPAY' : 'CASH',
        order_info_id: orderInfos[(i-1)%10].id,
        status: i % 2 === 0 ? 'COMPLETED' : 'PENDING',
      },
    }));
  }

  // OrderDetails
  for (let i = 1; i <= 10; i++) {
    await prisma.orderDetails.create({
      data: {
        product_variant_id: variants[(i-1)%10].id,
        order_id: orders[(i-1)%10].id,
        quantity: i,
        price: 10000 + i * 1000,
      },
    });
  }

  // Vouchers
  for (let i = 1; i <= 10; i++) {
    await prisma.vouchers.create({
      data: {
        code: `VOUCHER${i}`,
        discount_type: i % 2 === 0 ? 'PERCENTAGE' : 'FIXED_AMOUNT',
        discount_value: i % 2 === 0 ? 10 : 50000,
        description: `Voucher description ${i}`,
        min_order_value: 100000,
        max_discount: 20000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        usage_limit: 100,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
