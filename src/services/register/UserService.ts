import { hash } from 'bcryptjs'
import { IUsersRepository } from '../../repositories/IUsersRepository'
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError'
import { User } from '@prisma/client'

interface RegisterUserRequest {
    name: string,
    email: string,
    password: string
}

interface RegisterUserResponse {
    user: User
}

export class UserService {

    constructor(private usersRepository: IUsersRepository) { }

    async registerUser({ name, email, password }: RegisterUserRequest): Promise<RegisterUserResponse> {

        const user = await this.usersRepository.findByEmail(email)

        if (user != null) {
            throw new UserAlreadyExistsError()
        }
        const passwordHash = await hash(password, 6)

        const userCreated = await this.usersRepository.create({ name, email, password_hash: passwordHash })

        return {
            user: userCreated
        }
    }
}

