import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsErrors";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { User } from "@prisma/client";

interface AuthServiceRequest {
    email: string
    password: string
}

interface AuthServiceResponse {
    user: User
}

export class AuthService {
    constructor(private usersRepository: IUsersRepository) {
    }

    public async authUser({ email, password }: AuthServiceRequest): Promise<AuthServiceResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return { user }
    }
}