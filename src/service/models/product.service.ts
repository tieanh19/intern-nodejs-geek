import prisma from '../prisma.service';
import { Products } from '@prisma/client';

class ProductService {
    async getAllProducts(page: number = 1, pageSize: number = 10): Promise<{ data: any[]; total: number; totalPages: number; page: number; pageSize: number }> {
        const skip = (page - 1) * pageSize;
        const [data, total] = await Promise.all([
            prisma.products.findMany({
                skip,
                take: pageSize,
                include: { category: { select: { name: true } } },
            }),
            prisma.products.count(),
        ]);
        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize,
        };
    }

    // get products by category with pagination
    async getProductsByCategories(categoryId: string, page: number = 1, pageSize: number = 10): Promise<{ data: any[]; total: number; totalPages: number; page: number; pageSize: number }> {
        const skip = (page - 1) * pageSize;
        const [data, total] = await Promise.all([
            prisma.products.findMany({
                where: { category_id: categoryId },
                skip,
                take: pageSize,
                include: { category: { select: { name: true } } },
            }),
            prisma.products.count({ where: { category_id: categoryId } }),
        ]);
        return {
            data,
            total,
            totalPages: Math.ceil(total / pageSize),
            page,
            pageSize,
        };
    }
}

export default new ProductService();