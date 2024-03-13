import { CheckIn } from "@prisma/client"
import { ICheckInsRepository } from "../../repositories/interfaces/ICheckInsRepository"

interface CheckInRequest {
    userId: string
    gymId: string
}

interface CheckInRespose {
    checkIn: CheckIn
}

export class CheckInService {
    constructor(private checkInsRepository: ICheckInsRepository) {}

    async createCheckIn({userId, gymId}: CheckInRequest): Promise<CheckInRespose> {

        const checkInSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date)

        if(checkInSameDay) throw new Error()

        const checkIn = await this.checkInsRepository.create({user_id: userId, gym_id: gymId})

        return {checkIn}
    }
}