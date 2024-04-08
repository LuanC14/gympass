import { Gym, Prisma } from "@prisma/client";
import { IGymsRepository } from "../interfaces/IGymsRepository";
import { prisma } from "../../lib/prisma";

export class PrismaGymsRepository implements IGymsRepository {
    async findById(id: string): Promise<Gym | null> {
        return await prisma.gym.findUnique({ where: { id } });
    }
    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        return await prisma.gym.create({ data });
    }
    async searchMany(query: string, page: number): Promise<Gym[]> {
        return await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        });
    }
    async findManyNearby(latitude: number, longitude: number): Promise<Gym[]> {
        console.log(latitude, longitude)
        const gyms = await prisma.$queryRaw<Gym[]>`
       SELECT 
            * 
        FROM gyms
        WHERE (6371 * acos( cos( radians(${latitude}) ) 
            * cos( radians( latitude ) ) * cos( radians( longitude ) 
            - radians(${longitude}) ) + sin( radians(${latitude}) ) 
            * sin( radians( latitude ) ) ) ) <= 10
      `
        return gyms
    }

}