import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJwt(request: FastifyRequest, res: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized.' })
  }
}