import { FastifyInstance } from "fastify";
import { UserController } from "./UserController";
import { verifyJwt } from "../../../middlewares/verifyJwt";

const userController = new UserController()

export async function userRoutes(app: FastifyInstance) {
    await app.addHook('onRequest', userController.build)
    
    app.post("/users", userController.register)
    app.get("/users/me", { onRequest: [verifyJwt] }, userController.getUser)
}