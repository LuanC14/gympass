import { CheckIn } from "@prisma/client"
import { ICheckInsRepository } from "../../repositories/interfaces/ICheckInsRepository"
import { IGymsRepository } from "../../repositories/interfaces/IGymsRepository"
import { ResourceNotFoundError } from "../../errors/ResourceNotFoundError"
import { getDistanceBetweenCoordinates } from "../../utils/getDistanceBetweenCoordinates"

interface CheckInRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInRespose {
    checkIn: CheckIn
}

export class CheckInService {
    constructor(
        private checkInsRepository: ICheckInsRepository,
        private gymsRepository: IGymsRepository,
    ) { }

    async createCheckIn({ userId, gymId, userLatitude, userLongitude }: CheckInRequest): Promise<CheckInRespose> {

        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new Error()
        }

        const checkInSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

        if (checkInSameDay) throw new Error()

        const checkIn = await this.checkInsRepository.create({ user_id: userId, gym_id: gymId })

        return { checkIn }
    }
}