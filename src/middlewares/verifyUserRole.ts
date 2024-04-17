import { Role } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

interface VerifyUserRole {
    requiredRole: Role
}

export function verifyUserRole({ requiredRole }: VerifyUserRole) {
    return async (req: FastifyRequest, res: FastifyReply) => {
        if (requiredRole != req.user.role) return res.status(401).send({ message: 'Unathourized' })
    }
}

