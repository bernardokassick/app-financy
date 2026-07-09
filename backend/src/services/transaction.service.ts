import { Service } from "typedi";
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input.js";
import { prismaClient } from "../../prisma/prisma.js";
import { TransactionType } from "@prisma/client";

interface GetTransactionsFilters {
    startDate: Date;
    endDate: Date;
    search?: string;
    type?: string;
    categoryId?: string;
    skip: number;
    limit: number;
}

@Service()
export class TransactionService {

    async createTransaction(data: CreateTransactionInput, userId: string) {
        return prismaClient.transaction.create({
            data: {
                ...data,
                userId
            },
        });
    }

    async getTransactionsByUserId(userId: string, filters: GetTransactionsFilters) {
        const whereClause = {
            userId,
            date: {
                gte: filters.startDate,
                lte: filters.endDate,
            },
            description: filters.search ? {
                contains: filters.search,
            } : undefined,
            type: filters.type ? (filters.type as TransactionType) : undefined,
            categoryId: filters.categoryId ? filters.categoryId : undefined,
        };

        const [transactions, total] = await Promise.all([
            prismaClient.transaction.findMany({
                where: whereClause,
                skip: filters.skip,
                take: filters.limit,
                orderBy: {
                    date: 'desc'
                },
                include: {
                    category: true
                }
            }),
            prismaClient.transaction.count({
                where: whereClause
            })
        ]);

        return {
            transactions,
            total
        };
    }

    async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
        const transaction = await prismaClient.transaction.findUnique({
            where: { id, userId },
        });

        if (!transaction) {
            throw new Error('Transação não encontrada.');
        }

        return prismaClient.transaction.update({
            where: { id, userId },
            data: {
                amount: data.amount ?? transaction.amount,
                description: data.description ?? transaction.description,
                date: data.date ?? transaction.date,
                categoryId: data.categoryId ?? transaction.categoryId,
                type: data.type ?? transaction.type,
            },
        });
    }

    async deleteTransaction(id: string, userId: string) {
        const transaction = await prismaClient.transaction.findUnique({
            where: { id, userId },
        });

        if (!transaction) {
            throw new Error('Transação não encontrada.');
        }

        await prismaClient.transaction.delete({
            where: { id, userId },
        });
    }

    async findTransaction(id: string, userId: string) {
        const transaction = await prismaClient.transaction.findUnique({
            where: { id, userId },
        });

        if (!transaction) {
            throw new Error('Transação não encontrada');
        }

        return transaction;
    }
}