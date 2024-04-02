import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository";
import { GymService } from "../../services/gym/GymService";

export function makeGymService() {
    const gymsRepository = new InMemoryGymsRepository()
    const gymsService = new GymService(gymsRepository)

    return gymsService
}