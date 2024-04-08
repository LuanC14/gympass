import { FastifyInstance } from "fastify"
import { GymController } from "./GymController"
import { verifyJwt } from "../../../middlewares/verifyJwt"

const gymController = new GymController()

export async function gymRoutes(app: FastifyInstance) {
    await app.addHook('onRequest', verifyJwt)
    await app.addHook('onRequest', gymController.build)

    app.post("/gyms", gymController.create)
    app.get("/gyms/search", gymController.search)
    app.get("/gyms/nearby", gymController.nearby)
}