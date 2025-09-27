import prisma from '../utils/prisma.service';
import { Categories } from '@prisma/client';


class CategoryService {
    async getAllCategory(page: number = 1, pageSize: number = 10): Promise<{ data: Categories[]; total: number; totalPages: number; page: number; pageSize: number }> {
        const skip = (page - 1) * pageSize;
        const [data, total] = await Promise.all([
            prisma.categories.findMany({ skip, take: pageSize }),
            prisma.categories.count(),
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

export default new CategoryService();