import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { makeAuthService } from "../../../utils/factories/makeAuthService";
import { InvalidCredentialsError } from "../../../errors/InvalidCredentialsErrors";
import { AuthService } from "../../../services/auth/AuthService";
import { sign } from "node:crypto";

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

            const refreshToken = await res.jwtSign({},
                {
                    sign: {
                        sub: user.id,
                        expiresIn: '7d'
                    },
                },
            )

            return res
                .status(200)
                .setCookie('refreshToken', refreshToken, {
                    path: "/",
                    secure: true,  // Define HTTPS para o cookie,
                    sameSite: true, // Acessível somente no mesmo domínio
                    httpOnly: true // Acessivel somente pelo backend
                })
                .send({ token })

        } catch (error) {
            if (error instanceof InvalidCredentialsError) return res.status(400).send({ message: error.message })
            throw error
        }

    }

    public async refresh(req: FastifyRequest, res: FastifyReply) {
        await req.jwtVerify({ onlyCookie: true }) // verifica se há autenticação somente nos cookies, ao invés do Header da requisição.
        console.log(req.user.sub)
        
        const token = await res.jwtSign({},
            {
                sign: {
                    sub: req.user.sub
                }
            }
        )

        const refreshToken = await res.jwtSign({},
            {
                sign: {
                    sub: req.user.sub,
                    expiresIn: '7d'
                }
            }
        )

        return res
            .status(200)
            .setCookie('refreshToken', refreshToken, {
                path: "/",
                secure: true,
                sameSite: true,
                httpOnly: true
            })
            .send({ token })

    }
}
