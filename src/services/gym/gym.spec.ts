import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository";
import { GymService } from "./GymService";

let gymsRepository: InMemoryGymsRepository
let service: GymService

describe('GymService: Create gym use case', async () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        service = new GymService(gymsRepository)
    })

    it('deverá ser possível criar a academia', async () => {

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

describe('GymService: Search gym use case', async () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        service = new GymService(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
          title: 'JavaScript Gym',
          description: null,
          phone: null,
          latitude: -27.2092052,
          longitude: -49.6401091,
        })
    
        await gymsRepository.create({
          title: 'TypeScript Gym',
          description: null,
          phone: null,
          latitude: -27.2092052,
          longitude: -49.6401091,
        })
    
        const { gyms } = await service.searchGymsByTitle({
          query: 'JavaScript',
          page: 1,
        })
    
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
      })

    it('deverá ser possível fazer uma busca paginada das academias', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -27.2092052,
                longitude: -49.6401091,
            })
        }

        const { gyms } = await service.searchGymsByTitle({
            query: 'JavaScript',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ])
    })
})