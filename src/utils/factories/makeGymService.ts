import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository";
import { PrismaGymsRepository } from "../../repositories/Prisma/PrismaGymsRepository";
import { GymService } from "../../services/gym/GymService";

export function makeGymService() {
    const gymsRepository = new PrismaGymsRepository()
    const gymsService = new GymService(gymsRepository)

    return gymsService
}