import { prisma } from "../../lib/prisma";
import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../interfaces/IUsersRepository";

export class PrismaUsersRepository implements IUsersRepository {

    async create(data: Prisma.UserCreateInput) {
        return await prisma.user.create({ data })
    }

    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }

    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}