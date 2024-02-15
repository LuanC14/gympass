import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { IUsersRepository } from "./IUsersRepository";

export class PrismaUsersRepository implements IUsersRepository {

    async create(data: Prisma.UserCreateInput) {
        return await prisma.user.create({ data })
    }

    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }
}