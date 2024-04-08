import { FastifyReply, FastifyRequest } from "fastify";
import { CheckInService } from "../../../services/checkIn/CheckInService";
import { makeCheckInService } from "../../../utils/factories/makeCheckInService";
import { z } from "zod";

export class CheckInController {

    private service!: CheckInService;

    async build() {
        this.service = makeCheckInService()
    }


    async create(req: FastifyRequest, res: FastifyReply) {
        const createCheckInParamsSchema = z.object({
            gymId: z.string().uuid(),
        })

        const createCheckInBodySchema = z.object({
            latitude: z.number().refine((value) => {
                return Math.abs(value) <= 90
            }),
            longitude: z.number().refine((value) => {
                return Math.abs(value) <= 180
            }),
        })

        const { gymId } = createCheckInParamsSchema.parse(req.params)
        const { latitude, longitude } = createCheckInBodySchema.parse(req.body)


        await this.service.createCheckIn({
            gymId,
            userId: req.user.sub,
            userLatitude: latitude,
            userLongitude: longitude,
        })

        return res.status(201).send()
    }

    async history(req: FastifyRequest, res: FastifyReply) {
        const checkInHistoryQuerySchema = z.object({
            page: z.coerce.number().min(1).default(1),
        })

        const { page } = checkInHistoryQuerySchema.parse(req.query)


        const { checkIns } = await this.service.fecthUserCheckIns({
            page,
            userId: req.user.sub,
        })

        return res.status(200).send({
            checkIns,
        })
    }

    async metrics(req: FastifyRequest, res: FastifyReply) {

        const { checkInsCount } = await this.service.getUserMetrics({
            userId: req.user.sub,
        })

        return res.status(200).send({
            checkInsCount,
        })
    }

    async validate(req: FastifyRequest, res: FastifyReply) {
        const validateCheckInParamsSchema = z.object({
          checkInId: z.string().uuid(),
        })
      
        const { checkInId } = validateCheckInParamsSchema.parse(req.params)
      
      
        await this.service.validateCheckIn({
          checkInId,
        })
      
        return res.status(204).send()
      }
}