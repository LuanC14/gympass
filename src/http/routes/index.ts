import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { verifyJwt } from "../../middlewares/verifyJwt";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";


export async function appRoutes(app: FastifyInstance) {
    userRoutes(app)
    authRoutes(app)
}