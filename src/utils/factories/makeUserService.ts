import { PrismaUsersRepository } from "../../repositories/Prisma/PrismaUsersRepository"
import { UserService } from "../../services/user/UserService"

export function makeUserService() {
    const prismaUsersRepository = new PrismaUsersRepository()
    const userService = new UserService(prismaUsersRepository)

    return userService
}