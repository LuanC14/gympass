import { InMemoryCheckInsRepository } from "../../repositories/inMemory/InMemoryCheckInsRepository"
import { CheckInService } from "./CheckInService"
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest"


let repository: InMemoryCheckInsRepository
let service: CheckInService

describe('Check In service', () => {
    beforeEach(() => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await service.createCheckIn({
            gymId: 'gym-1',
            userId: 'user-1'
        })
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    
        await service.createCheckIn({
          gymId: 'gym-01',
          userId: 'user-01',
        })
    
        await expect(() =>
        service.createCheckIn({
            gymId: 'gym-01',
            userId: 'user-01',
          }),
        ).rejects.toBeInstanceOf(Error)
      })
    
      it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    
        await service.createCheckIn({
          gymId: 'gym-01',
          userId: 'user-01',
        })
    
        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    
        const { checkIn } = await service.createCheckIn({
          gymId: 'gym-01',
          userId: 'user-01',
        })
    
        expect(checkIn.id).toEqual(expect.any(String))
      })
})