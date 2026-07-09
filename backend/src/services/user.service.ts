import { prismaClient } from "../../prisma/prisma.js";
import { CreateUserInput } from "../dtos/input/user.input.js";

export class UserService {
    async createUser(data: CreateUserInput) {
        const findUser = await prismaClient.user.findUnique({
            where: {
                email: data.email
            },
        });

        if (findUser) {
            throw new Error("Usuário já existe");
        }

        return prismaClient.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: null
            },
        });
    }

    async findUser(id: string) {
        const user = await prismaClient.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }

    async updateUser(id: string, data: { name: string }) {
        const user = await prismaClient.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return prismaClient.user.update({
            where: { id },
            data: {
                name: data.name,
            },
        });
    }
}