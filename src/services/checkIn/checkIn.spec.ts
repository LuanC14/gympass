import { InMemoryCheckInsRepository } from "../../repositories/inMemory/InMemoryCheckInsRepository"
import { CheckInService } from "./CheckInService"
import { beforeEach, expect, describe, it } from "vitest"


let repository: InMemoryCheckInsRepository
let service: CheckInService

describe('Check In service', () => {
    beforeEach(() => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)
    })

    it('should be able to check in', async () => {
        const { checkIn } = await service.createCheckIn({
            gymId: 'gym-1',
            userId: 'user-1'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})