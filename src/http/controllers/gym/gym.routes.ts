import { FastifyInstance } from "fastify"
import { GymController } from "./GymController"
import { verifyJwt } from "../../../middlewares/verifyJwt"
import { verifyUserRole } from "../../../middlewares/verifyUserRole"

const gymController = new GymController()

export async function gymRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt)
    await app.addHook('onRequest', gymController.build)

    app.post("/gyms", { onRequest: [verifyUserRole({ requiredRole: 'ADMIN' })] }, gymController.create)
    app.get("/gyms/search", gymController.search)
    app.get("/gyms/nearby", gymController.nearby)
}