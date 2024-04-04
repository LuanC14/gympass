import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { makeAuthService } from "../../utils/factories/makeAuthService";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsErrors";
import { PrismaUsersRepository } from "../../repositories/Prisma/PrismaUsersRepository";
import { AuthService } from "../../services/auth/AuthService";

export class AuthController {

    private service!: AuthService;

    async build() {
        this.service = makeAuthService()
    }

    public async auth(req: FastifyRequest, res: FastifyReply) {

        const authBodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const { email, password } = authBodySchema.parse(req.body)

        try {
            const { user } = await this.service.authUser({ email, password })

            const token = await res.jwtSign({},
                {
                    sign: {
                        sub: user.id,
                    },
                },
            )

            return res.status(200).send({ token })

        } catch (error) {
            if (error instanceof InvalidCredentialsError) return res.status(400).send({ message: error.message })
            throw error
        }

    }
}
