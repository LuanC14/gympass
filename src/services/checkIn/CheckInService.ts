import { CheckIn } from "@prisma/client"
import { ICheckInsRepository } from "../../repositories/interfaces/ICheckInsRepository"
import { IGymsRepository } from "../../repositories/interfaces/IGymsRepository"
import { ResourceNotFoundError } from "../../errors/ResourceNotFoundError"
import { getDistanceBetweenCoordinates } from "../../utils/getDistanceBetweenCoordinates"
import { MaxDistanceError } from "../../errors/MaxDistanceError"
import { MaxNumberOfCheckInsError } from "../../errors/MaxNumberOfCheckInsError"

interface CheckInRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInRespose {
    checkIn: CheckIn
}

interface FetchUserCheckInsRequest {
    userId: string
    page: number
}

interface FetchUserCheckInsResponse {
    checkIns: CheckIn[]
}

export class CheckInService {
    constructor(
        private checkInsRepository: ICheckInsRepository,
        private gymsRepository?: IGymsRepository,
    ) { }

    async createCheckIn({ userId, gymId, userLatitude, userLongitude }: CheckInRequest): Promise<CheckInRespose> {

        const gym = await this.gymsRepository!.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceError()

        const checkInSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

        if (checkInSameDay) throw new MaxNumberOfCheckInsError()

        const checkIn = await this.checkInsRepository.create({ user_id: userId, gym_id: gymId })

        return { checkIn }
    }

    async FecthUserCheckIns({ userId, page }: FetchUserCheckInsRequest): Promise<FetchUserCheckInsResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

        return {
            checkIns,
        }
    }
}