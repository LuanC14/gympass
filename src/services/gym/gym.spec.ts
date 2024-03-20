import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository";
import { GymService } from "./GymService";

let gymsRepository: InMemoryGymsRepository
let service: GymService

describe('Gym Service', async () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        service = new GymService(gymsRepository)
    })

    it('Deverá ser possível criar a academia', async () => {

        const { gym } = await service.createGym({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: -11.8074901,
            longitude: -42.0650823,
        })

        expect(gym.id).toEqual(expect.any(String))
    })
}) 