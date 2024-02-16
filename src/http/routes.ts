import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { auth } from "./controllers/auth";

export async function appRoutes(app: FastifyInstance) {
    app.post("/users", register)
    app.post('/sessions', auth)
}