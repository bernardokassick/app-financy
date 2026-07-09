import { Service } from "typedi";
import { prismaClient } from "../../prisma/prisma.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input.js";

@Service()
export class CategoryService {

    async createCategory(data: CreateCategoryInput, userId: string) {
        return prismaClient.category.create({
            data: {
                name: data.name,
                description: data.description,
                icon: data.icon,
                color: data.color,
                userId
            },
        });
    }

    async getCategoriesByUserId(userId: string) {
        return prismaClient.category.findMany({
            where: { userId },
        });
    }

    async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
        const category = await prismaClient.category.findUnique({
            where: { id, userId },
        });

        if (!category) {
            throw new Error('Categoria não encontrada.');
        }

        return prismaClient.category.update({
            where: { id, userId },
            data: {
                name: data.name ?? category.name,
                description: data.description ?? category.description,
                icon: data.icon ?? category.icon,
                color: data.color ?? category.color,
            },
        });
    }

    async deleteCategory(id: string, userId: string) {
        const category = await prismaClient.category.findUnique({
            where: { id, userId },
        });

        if (!category) {
            throw new Error('Categoria não encontrada.');
        }

        await prismaClient.category.delete({
            where: { id, userId },
        });
    }

    async findCategory(id: string, userId: string) {
        const category = await prismaClient.category.findUnique({
            where: { id, userId },
        });

        if (!category) {
            throw new Error('Categoria não encontrada');
        }

        return category;
    }
}