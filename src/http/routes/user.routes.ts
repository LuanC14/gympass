import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { verifyJwt } from "../../middlewares/verifyJwt";

const userController = new UserController()

export  function userRoutes(app: FastifyInstance) {
    app.post("/users", {onRequest: [userController.build]}, userController.register)
    app.get("/users/me", {onRequest: [userController.build, verifyJwt]} ,userController.getUser)
}