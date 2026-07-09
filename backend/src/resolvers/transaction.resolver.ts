import { Service } from "typedi";
import { TransactionModel } from "../models/transaction.model.js";
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { IsAuth } from "../middlewares/auth.middleware.js";
import { TransactionService } from "../services/transaction.service.js";
import { CategoryService } from "../services/category.service.js";
import { UserService } from "../services/user.service.js";
import { UserModel } from "../models/user.model.js";
import { CategoryModel } from "../models/category.model.js";
import { CreateTransactionInput, UpdateTransactionInput } from "../dtos/input/transaction.input.js";
import { GraphqlUser } from "../graphql/decorators/user.decorator.js";
import { User } from "@prisma/client";

@ObjectType()
class PaginatedTransactions {
  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];

  @Field(() => Int)
  total!: number;
}

@Service()
@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
    private transactionService = new TransactionService();
    private categoryService = new CategoryService();
    private userService = new UserService();

    @Mutation(() => TransactionModel)
    async createTransaction(
        @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
        @GraphqlUser() user: User
    ): Promise<TransactionModel> {
        return this.transactionService.createTransaction(data, user.id);
    }

    @Query(() => PaginatedTransactions) // Mudança aqui: retorna o objeto paginado
    async getTransactions(
        @GraphqlUser() user: User,
        @Arg("month", () => Int, { nullable: true }) month?: number,
        @Arg("year", () => Int, { nullable: true }) year?: number,
        @Arg("search", () => String, { nullable: true }) search?: string,
        @Arg("type", () => String, { nullable: true }) type?: string,
        @Arg("categoryId", () => String, { nullable: true }) categoryId?: string,
        @Arg("page", () => Int, { defaultValue: 1 }) page: number // Adicionamos a página
    ): Promise<PaginatedTransactions> {
        const now = new Date();
        const targetMonth = month ?? (now.getMonth() + 1);
        const targetYear = year ?? now.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const limit = 10; // Itens por página
        const skip = (page - 1) * limit; // Quantos pular

        return this.transactionService.getTransactionsByUserId(user.id, {
            startDate,
            endDate,
            search,
            type,
            categoryId,
            skip,
            limit
        });
    }

    @Mutation(() => TransactionModel)
    async updateTransaction(
        @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
        @Arg('id', () => String) id: string,
        @GraphqlUser() user: User
    ): Promise<TransactionModel> {
        return this.transactionService.updateTransaction(id, data, user.id);
    }

    @Mutation(() => Boolean)
    async deleteTransaction(
        @Arg('id', () => String) id: string,
        @GraphqlUser() user: User
    ): Promise<boolean> {
        await this.transactionService.deleteTransaction(id, user.id);
        return true;
    }

    @FieldResolver(() => UserModel)
    async user(@Root() transaction: TransactionModel): Promise<UserModel> {
        return this.userService.findUser(transaction.userId);
    }

    @FieldResolver(() => CategoryModel)
    async category(
        @Root() transaction: TransactionModel, 
        @GraphqlUser() user: User
    ): Promise<CategoryModel> {
        return this.categoryService.findCategory(transaction.categoryId, user.id);
    }
}