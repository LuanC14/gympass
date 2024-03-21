import { Gym, Prisma } from "@prisma/client";

export interface IGymsRepository {
    findById(id: string): Promise<Gym | null>
    create(data: Prisma.GymCreateInput): Promise<Gym>
    searchMany(query: string, page: number): Promise<Gym[]>
    findManyNearby(latitude: number, longitude: number): Promise<Gym[]>
}