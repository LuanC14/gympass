import { PrismaUsersRepository } from "../../repositories/PrismaUsersRepository"
import { UserService } from "../../services/register/UserService"

export function makeRegisterService() {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new UserService(prismaUsersRepository)

    return registerService
}