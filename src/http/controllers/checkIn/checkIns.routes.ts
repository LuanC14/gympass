import { FastifyInstance } from "fastify"
import { verifyJwt } from "../../../middlewares/verifyJwt"
import { CheckInController } from "./CheckInController"

const checkInController = new CheckInController()

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt)
    app.addHook('onRequest', checkInController.build)
  
    app.post('/gyms/:gymId/check-ins', checkInController.create)
    app.get('/check-ins/history', checkInController.history)
    app.patch('/check-ins/:checkInId/validate', checkInController.validate)
    app.get('/check-ins/metrics', checkInController.metrics)
  }