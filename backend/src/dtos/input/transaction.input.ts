import { Field, GraphQLISODateTime, InputType } from "type-graphql";
import { TransactionType } from "@prisma/client";

@InputType()
export class CreateTransactionInput {
    @Field(() => String)
    description!: string;
    
    @Field(() => Number)
    amount!: number;

    @Field(() => GraphQLISODateTime, { nullable: true })
    date?: Date;

    @Field(() => TransactionType)
    type!: TransactionType;

    @Field(() => String)
    categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
    @Field(() => String, { nullable: true })
    description?: string;
    
    @Field(() => Number, { nullable: true })
    amount?: number;

    @Field(() => GraphQLISODateTime, { nullable: true })
    date?: Date;

    @Field(() => TransactionType, { nullable: true })
    type?: TransactionType;

    @Field(() => String)
    categoryId!: string;
}