import { FastifySchema } from "fastify";

export const createUserSwaggerSchema: FastifySchema = {
    params: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                description: 'Nome do usuário'
            },
            email: {
                type: 'string',
                description: 'Email do usuário'
            },
            password: {
                type: 'string',
                description: 'Senha do usuário'
            }
        }
    },
    response: {
        201: {},
        409: {}
    }
}
