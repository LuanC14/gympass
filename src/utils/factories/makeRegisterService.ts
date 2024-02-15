import { PrismaUsersRepository } from "../../repositories/PrismaUsersRepository"
import { RegisterService } from "../../services/register/registerService"

export function makeRegisterService() {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaUsersRepository)

    return registerService
}