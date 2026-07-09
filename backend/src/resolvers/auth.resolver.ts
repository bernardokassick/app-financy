import { Arg, Mutation, Resolver } from "type-graphql";
import { Service } from "typedi";
import { AuthService } from "../services/auth.service.js";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output.js";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input.js";

@Service()
@Resolver()
export class AuthResolver {
    private authService = new AuthService();

    @Mutation(() => LoginOutput)
    async login(
        @Arg("data", () => LoginInput) data: LoginInput
    ): Promise<LoginOutput> {
        return this.authService.login(data);
    }

    @Mutation(() => RegisterOutput)
    async register(
        @Arg("data", () => RegisterInput) data: RegisterInput
    ): Promise<RegisterOutput> {
        return this.authService.register(data);
    }
}