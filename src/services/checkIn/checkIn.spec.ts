import { Decimal } from "@prisma/client/runtime/library"
import { InMemoryCheckInsRepository } from "../../repositories/inMemory/InMemoryCheckInsRepository"
import { CheckInService } from "./CheckInService"
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest"
import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository"


let repository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let service: CheckInService

describe('Check In service', () => {
    beforeEach(() => {
        repository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        service = new CheckInService(repository, gymsRepository)

        vi.useFakeTimers()

        gymsRepository.items.push({
          id: 'gym-01',
          title: 'JavaScript Gym',
          description: '',
          phone: '',
          latitude: new Decimal(-11.8074901), 
          longitude: new Decimal(-42.0650823),
        })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await service.createCheckIn({
            gymId: 'gym-1',
            userId: 'user-1',
            userLatitude: -11.8074901,
            userLongitude: -42.0650823
        })
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    
        await service.createCheckIn({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -11.8074901,
          userLongitude: -42.0650823
        })
    
        await expect(() =>
        service.createCheckIn({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -11.8074901,
            userLongitude: -42.0650823
          }),
        ).rejects.toBeInstanceOf(Error)
      })
    
      it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    
        await service.createCheckIn({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -11.8074901,
          userLongitude: -42.0650823
        })
    
        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    
        const { checkIn } = await service.createCheckIn({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -11.8074901,
          userLongitude: -42.0650823
        })
    
        expect(checkIn.id).toEqual(expect.any(String))
      })

      it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
          id: 'gym-02',
          title: 'JavaScript Gym',
          description: '',
          phone: '',
          latitude: new Decimal(-27.0747279),
          longitude: new Decimal(-49.4889672),
        })
    
        await expect(() =>
          service.createCheckIn({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -11.8103557,
            userLongitude: -42.0615918
          }),
        ).rejects.toBeInstanceOf(Error)
      })


})