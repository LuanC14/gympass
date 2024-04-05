import { FastifyInstance } from "fastify"
import { AuthController } from "../controllers/AuthController"

const authController = new AuthController()

export function authRoutes(app: FastifyInstance) {

    app.post("/auth", { onRequest: [authController.build] }, authController.auth)
}