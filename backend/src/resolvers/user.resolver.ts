import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "../models/user.model.js";
import { UserService } from "../services/user.service.js";
import { Service } from "typedi";
import { IsAuth } from "../middlewares/auth.middleware.js";
import { CreateUserInput, UpdateUserInput } from "../dtos/input/user.input.js";
import { UpdateCategoryInput } from "../dtos/input/category.input.js";
import { GraphqlUser } from "../graphql/decorators/user.decorator.js";
import { User } from "@prisma/client";

@Service()
@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
    private userService = new UserService();

    @Mutation(() => UserModel)
    async createUser(
        @Arg('data', () => CreateUserInput) data: CreateUserInput
    ): Promise<UserModel> {
        return this.userService.createUser(data);
    }

    @Query(() => UserModel)
    async getUser(
        @Arg('id', () => String) id: string,
        @GraphqlUser() user: User
    ): Promise<UserModel> {
        return this.userService.findUser(id);
    }

    @Mutation(() => UserModel)
    async updateUser(
        @Arg('id', () => String) id: string,
        @Arg('data', () => UpdateUserInput) data: UpdateUserInput,
        @GraphqlUser() user: User
    ): Promise<UserModel> {
        return this.userService.updateUser(id, data);
    }
}