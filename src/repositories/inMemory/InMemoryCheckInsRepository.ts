import { CheckIn, Prisma } from "@prisma/client";
import { ICheckInsRepository } from "../interfaces/ICheckInsRepository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements ICheckInsRepository {

    public items: CheckIn[] = []

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {

        const checkIn: CheckIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date()
        }

        this.items.push(checkIn)
        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {

        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameData = this.items.find(checkIn => {

            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay) // Verifica se a data está no intervalo do começo ao fim do dia

            return checkIn.user_id == userId && isOnSameDate
        })

        if (!checkInOnSameData) {
            return null
        }
        return checkInOnSameData
    }

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        return this.items
            .filter(item => item.user_id === userId)
            .slice((page - 1) * 20, page * 20)
        /*
            slice(0,20) = retorna do índice 0 até o 20°
            então, slice((page - 1) * 20, page * 20), quando receber a página 1, será a mesma coisa que a expressão slice(0,20)  
            para página 2, será slice(20, 40)
        */
    }

    async countByUserId(userId: string): Promise<number> {
        return this.items.filter((checkIn) => checkIn.user_id === userId).length
    }
}