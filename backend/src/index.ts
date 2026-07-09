import "dotenv/config";
import "reflect-metadata";
import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';
import { expressMiddleware } from '@as-integrations/express5';

import "./services/auth.service.js";
import { buildContext } from "./graphql/context/index.js";
import { AuthResolver } from './resolvers/auth.resolver.js';
import { UserResolver } from './resolvers/user.resolver.js';
import { CategoryResolver } from "./resolvers/category.resolver.js";
import { TransactionResolver } from "./resolvers/transaction.resolver.js";

async function boostrap() {

    const app = express()

    app.use(cors({
        origin: process.env.URL_CORS,
        credentials: true
    }));

    const schema = await buildSchema({
        resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
        validate: false,
        emitSchemaFile: './schema.graphql'
    })

    const server = new ApolloServer({
        schema
    })

    await server.start()

    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(server, {
            context: buildContext,
        }),
    );

    app.listen(4000, () => {
        console.log('Servidor rodando em ' + process.env.URL_GRAPHQL)
    })
}

boostrap()