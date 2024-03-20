import { Gym } from "@prisma/client"
import { IGymsRepository } from "../../repositories/interfaces/IGymsRepository"

interface CreateGymRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface CreateGymResponse {
    gym: Gym
}


export class GymService {

    constructor(private gymsRepository: IGymsRepository,) {}

    public async createGym({ title, description, phone, latitude, longitude }: CreateGymRequest): Promise<CreateGymResponse> {
        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        })

        return { gym }
    }
}