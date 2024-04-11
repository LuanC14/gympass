import { randomUUID } from "node:crypto";
import { IGymsRepository } from "../interfaces/IGymsRepository";
import { Gym, Prisma } from "@prisma/client";
import { getDistanceBetweenCoordinates } from "../../utils/tools/getDistanceBetweenCoordinates";

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find(gym => gym.id === id)
    return gym != null ? gym : null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }
    this.items.push(gym)
    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    return this.items.filter((item) => {

      const distance = getDistanceBetweenCoordinates(
        {
          latitude: userLatitude,
          longitude: userLongitude
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        },
      )

      return distance < 10 // Retorna apenas as academias que estão à 10 km do usuário
    })
  }
}