import { CheckIn, Prisma } from "@prisma/client";
import { ICheckInsRepository } from "../interfaces/ICheckInsRepository";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements ICheckInsRepository {
    async create(checkIn: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        return await prisma.checkIn.create({ data: checkIn });
    }
    async save(checkIn: CheckIn): Promise<CheckIn> {
        return await prisma.checkIn.update({
            where: {
                id: checkIn.id
            },
            data: checkIn
        })
    }
    async findById(id: string): Promise<CheckIn | null> {
        throw new Error("Method not implemented.");
    }
    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        return await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(), // gte(Maior ou igual que) após o começo desde dia específico
                    lte: endOfTheDay.toDate(), // lte(Menor ou igual que) antes do fim desde dia específico
                },
            },
        })

    }
    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        return await prisma.checkIn.findMany({
            where: {
                user_id: userId
            },
            take: 20,
            skip: (page - 1 * 20)
        })
    }

    async countByUserId(userId: string): Promise<number> {
        return await prisma.checkIn.count({ where: { user_id: userId } })
    }
}