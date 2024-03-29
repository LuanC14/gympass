import { z } from "zod"
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from "../../errors/UserAlreadyExistsError"
import { makeRegisterService } from "../../utils/factories/makeRegisterService"

export async function register(req: FastifyRequest, res: FastifyReply) {

    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    try {
        const service = makeRegisterService()

        await service.registerUser({ name, email, password })
    } catch (error: any) {
        if (error instanceof UserAlreadyExistsError) return res.status(409).send({ message: error.message })
        return res.status(500).send({ message: error.message })
    }

    return res.status(201).send()
}