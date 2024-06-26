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
        const checkIn = await prisma.checkIn.findUnique({
          where: {
            id,
          },
        })
    
        return checkIn
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
    async findManyByUserId(userId: string, page: number) {
        console.log("many", userId, page)
        const checkIns = await prisma.checkIn.findMany({
          where: {
            user_id: userId,
          },
          skip: (page - 1) * 20,
          take: 20,
        })
    
        return checkIns
      }

    async countByUserId(userId: string): Promise<number> {
        return await prisma.checkIn.count({ where: { user_id: userId } })
    }
}