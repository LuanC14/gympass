import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { verifyJwt } from "../../middlewares/verifyJwt";

const userController = new UserController()

export  function userRoutes(app: FastifyInstance) {
    app.post("/users", {onRequest: [userController.build]}, userController.register)
    app.get("/users", {onRequest: [userController.build, verifyJwt]} ,userController.getUser)
}