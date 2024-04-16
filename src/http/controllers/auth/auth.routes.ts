import { FastifyInstance } from "fastify"
import { AuthController } from "./AuthController"

const authController = new AuthController()

export async function authRoutes(app: FastifyInstance) {
    await app.addHook('onRequest', authController.build)

    app.post("/auth", authController.auth)
    app.patch("/auth/refresh", authController.refresh)
}