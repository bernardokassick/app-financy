import { Field, Float, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "type-graphql";
import { UserModel } from "./user.model.js";
import { CategoryModel } from "./category.model.js";
import { TransactionType } from "@prisma/client";

registerEnumType(TransactionType, {
  name: "TransactionType",
});

@ObjectType()
export class TransactionModel {

    @Field(() => ID)
    id!: string;

    @Field(() => String)
    description!: string;

    @Field(() => Float)
    amount!: number;

    @Field(() => GraphQLISODateTime)
    date!: Date;

    @Field(() => TransactionType)
    type!: TransactionType;

    @Field(() => String)
    userId!: string;

    @Field(() => UserModel, { nullable: true })
    user?: UserModel;

    @Field(() => String)
    categoryId!: string;

    @Field(() => CategoryModel, { nullable: true })
    category?: CategoryModel;
}