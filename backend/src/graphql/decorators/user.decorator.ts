import { createParameterDecorator, ResolverData } from "type-graphql"
import { GraphqlContext } from "../context/index.js"
import { User } from "@prisma/client"
import { prismaClient } from "../../../prisma/prisma.js"


export const GraphqlUser = () => {
    return createParameterDecorator(async({
        context
    }: ResolverData<GraphqlContext>): Promise<User | null> => {
        if (!context || !context.user) return null

        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: context.user
                }
            })

            if (!user) throw new Error('Usuário não encontrado')

            return user
        } catch (error) { 
            console.error("Erro ao buscar usuário:", error);
            return null
        }
    })
}