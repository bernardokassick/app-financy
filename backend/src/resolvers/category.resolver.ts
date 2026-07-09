import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { CategoryModel } from "../models/category.model.js";
import { IsAuth } from "../middlewares/auth.middleware.js";
import { CategoryService } from "../services/category.service.js";
import { UserService } from "../services/user.service.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../dtos/input/category.input.js";
import { GraphqlUser } from "../graphql/decorators/user.decorator.js";
import { User } from "@prisma/client";
import { UserModel } from "../models/user.model.js";


@Service()
@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
    private categoryService = new CategoryService();
    private userService = new UserService();

    @Mutation(() => CategoryModel)
    async createCategory(
        @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
        @GraphqlUser() user: User
    ): Promise<CategoryModel> {
        return this.categoryService.createCategory(data, user.id);
    }

    @Query(() => [CategoryModel])
    async getCategories(
        @GraphqlUser() user: User
    ): Promise<CategoryModel[]> {
        return this.categoryService.getCategoriesByUserId(user.id);
    }

    @Mutation(() => CategoryModel)
    async updateCategory(
        @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
        @Arg('id', () => String) id: string,
        @GraphqlUser() user: User
    ): Promise<CategoryModel> {
        return this.categoryService.updateCategory(id, data, user.id);
    }

    @Mutation(() => Boolean)
    async deleteCategory(
        @Arg('id', () => String) id: string,
        @GraphqlUser() user: User
    ): Promise<boolean> {
        await this.categoryService.deleteCategory(id, user.id);
        return true;
    }
    
    @FieldResolver(() => UserModel)
    async user(@Root() category: CategoryModel): Promise<UserModel> {
        return this.userService.findUser(category.userId);
    }
}