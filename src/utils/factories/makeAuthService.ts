import { PrismaUsersRepository } from "../../repositories/PrismaUsersRepository";
import { AuthService } from "../../services/auth/AuthService";

export function makeAuthService() {
    const usersRepository = new PrismaUsersRepository()
    const authService = new AuthService(usersRepository)

    return authService
}