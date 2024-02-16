import { PrismaUsersRepository } from "../../repositories/Prisma/PrismaUsersRepository"
import { UserService } from "../../services/user/UserService"

export function makeRegisterService() {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new UserService(prismaUsersRepository)

    return registerService
}