import { GymsRepository } from "../interfaces/GymsRepository";
import { Gym } from "@prisma/client";

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findById(id: string): Promise<Gym | null> {
        const gym = this.items.find(gym => gym.id = id)
        return gym != null ? gym : null
    }
}