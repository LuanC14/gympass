import { FastifyInstance } from "fastify";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";
import { verifyJwt } from "../middlewares/verifyJwt";

const userController = new UserController()
const authController = new AuthController()

export async function appRoutes(app: FastifyInstance) {
    app.post("/users", userController.register)
    app.post('/sessions', authController.auth)

    // Authenticated
    app.get("/users", {onRequest: [verifyJwt]} ,userController.getUser)
}