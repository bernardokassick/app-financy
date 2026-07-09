import { Field, ID, ObjectType } from "type-graphql"
import { UserModel } from "./user.model.js";

@ObjectType()
export class CategoryModel {

    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string;

    @Field(() => String, { nullable: true })
    description?: string | null;

    @Field(() => String)
    icon!: string;

    @Field(() => String)
    color!: string;

    @Field(() => String)
    userId!: string;

    @Field(() => UserModel, { nullable: true })
    user?: UserModel;
}