import { CheckIn, Prisma } from "@prisma/client";
import { ICheckInsRepository } from "../interfaces/ICheckInsRepository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements ICheckInsRepository {

    public items: CheckIn[] = []

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

}