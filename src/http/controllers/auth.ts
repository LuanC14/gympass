import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { makeAuthService } from "../../utils/factories/makeAuthService";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsErrors";


export async function auth(req: FastifyRequest, res: FastifyReply) {

    const authBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authBodySchema.parse(req.body)

    try {
        const service = makeAuthService()
        await service.authUser({ email, password })

    } catch (error) {
        if (error instanceof InvalidCredentialsError) return res.status(400).send({ message: error.message })
        throw error
    }

    return res.status(200).send()
}