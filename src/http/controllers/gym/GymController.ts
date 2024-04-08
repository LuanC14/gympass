import { FastifyReply, FastifyRequest } from "fastify";
import { GymService } from "../../../services/gym/GymService"
import { makeGymService } from "../../../utils/factories/makeGymService"
import { z } from "zod";

export class GymController {

    private service!: GymService;

    async build() {
        this.service = makeGymService()
    }

    async create(req: FastifyRequest, res: FastifyReply) {
        const createGymBodySchema = z.object({
            title: z.string(),
            description: z.string().nullable(),
            phone: z.string().nullable(),
            latitude: z.number().refine((value) => {
                return Math.abs(value) <= 90
            }),
            longitude: z.number().refine((value) => {
                return Math.abs(value) <= 180
            }),
        })

        const { title, description, phone, latitude, longitude } =
            createGymBodySchema.parse(req.body)

        const g = await this.service.createGym({
            title,
            description,
            phone,
            latitude,
            longitude,
        })

        return res.status(201).send(g)
    }

    async search(req: FastifyRequest, res: FastifyReply) {

        const searchGymsQuerySchema = z.object({
            q: z.coerce.string(),
            page: z.coerce.number().min(1).default(1),
        })

        const { q, page } = searchGymsQuerySchema.parse(req.query)


        const { gyms } = await this.service.searchGymsByTitle({
            query: q,
            page,
        })


        return res.status(200).send({
            gyms,
        })
    }

    async nearby(req: FastifyRequest, res: FastifyReply) {
        const nearbyGymsQuerySchema = z.object({
            latitude: z.coerce.number().refine((value) => {
                return Math.abs(value) <= 90
            }),
            longitude: z.coerce.number().refine((value) => {
                return Math.abs(value) <= 180
            }),
        })

        const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query)

        const { gyms } = await this.service.fetchNearbyGyms({
            userLatitude: latitude,
            userLongitude: longitude,
        })

        return res.status(200).send({
            gyms
        })
    }
}
