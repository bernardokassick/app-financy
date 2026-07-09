import { MiddlewareFn } from "type-graphql";
import { GraphqlContext } from "../graphql/context/index.js";

export const IsAuth: MiddlewareFn<GraphqlContext> = async ({ context }, next) => {
    if (!context.user) {
        throw new Error("Not authenticated");
    }

    return next();
}