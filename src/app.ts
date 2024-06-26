import fastify, { FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { userRoutes } from './http/controllers/user/user.routes'
import { authRoutes } from './http/controllers/auth/auth.routes'
import { gymRoutes } from './http/controllers/gym/gym.routes'
import { checkInsRoutes } from './http/controllers/checkIn/checkIns.routes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: "refreshToken",
        signed: false // Sem hash 
    },
    sign: {
        expiresIn: "10m"
    }
})

app.register(import('@fastify/swagger'));
app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation'
});

app.register(fastifyCookie)
app.register(userRoutes)
app.register(authRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, req, res) => {
    if (error instanceof ZodError) {
        return res.status(400).send({ message: 'Validation error', issues: error.format() })
    }

    if (env.NODE_ENV != 'production') {
        console.error(error)
    } else {
        // Log to external tools
    }

    return res.status(500).send({ message: 'Internal Server Error.' })
})