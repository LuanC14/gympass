import { CheckIn } from "@prisma/client"
import { ICheckInsRepository } from "../../repositories/interfaces/ICheckInsRepository"
import { IGymsRepository } from "../../repositories/interfaces/IGymsRepository"
import { ResourceNotFoundError } from "../../errors/ResourceNotFoundError"
import { getDistanceBetweenCoordinates } from "../../utils/getDistanceBetweenCoordinates"
import { MaxDistanceError } from "../../errors/MaxDistanceError"
import { MaxNumberOfCheckInsError } from "../../errors/MaxNumberOfCheckInsError"
import dayjs from "dayjs"
import { LateCheckInValidationError } from "../../errors/LateCheckInValidationError"

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

interface GetUserMetricsRequest {
    userId: string
}

interface GetUserMetricsResponse {
    checkInsCount: number
}

interface ValidateCheckInRequest {
    checkInId: string
  }
  
  interface ValidateCheckInResponse {
    checkIn: CheckIn
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

    async fecthUserCheckIns({ userId, page }: FetchUserCheckInsRequest): Promise<FetchUserCheckInsResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

        return {
            checkIns,
        }
    }

    async getUserMetrics({ userId }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
        const checkInsCount = await this.checkInsRepository.countByUserId(userId)
        return { checkInsCount }
    }

    // Quando o serviço gera um check-in, ele tem até 20 minutos para validar em uma academia
    async validateCheckIn({checkInId}: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)
    
        if (!checkIn) {
          throw new ResourceNotFoundError()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes'
        )

        if(distanceInMinutesFromCheckInCreation > 20) throw new LateCheckInValidationError()
    
        checkIn.validated_at = new Date()
    
        await this.checkInsRepository.save(checkIn)
    
        return {
          checkIn,
        }
      }


}