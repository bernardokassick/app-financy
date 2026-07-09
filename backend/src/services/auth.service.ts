import type { User } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma.js";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import { Service } from "typedi";

@Service()
export class AuthService {

    async login(data: LoginInput) {
        const existingUser = await prismaClient.user.findUnique({
            where: { 
                email: data.email 
            }
        });
        
        if (!existingUser) throw new Error('Email ou senha inválidos.');

        if (!existingUser.password) throw new Error('Email ou senha inválidos.');

        const compare = await comparePassword(data.password, existingUser.password);
        if (!compare) throw new Error('Email ou senha inválidos.');
        
        return this.generateTokens(existingUser);
    }

    async register(data: RegisterInput) {
        const existingUser = await prismaClient.user.findUnique({
            where: { 
                email: data.email 
            }
        });
        
        if (existingUser) throw new Error('Usuário com este email já existe.');

        if (!data.password) throw new Error('A senha é obrigatória.');

        const hash = await hashPassword(data.password);

        const newUser = await prismaClient.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hash
            }
        });

        return this.generateTokens(newUser);
    }

    generateTokens(user: User) {
        const token = signJwt( { id: user.id, email: user.email }, '15m' )
        const refreshToken = signJwt( { id: user.id, email: user.email }, '1d' )
        return { token, refreshToken, user };
    }
}