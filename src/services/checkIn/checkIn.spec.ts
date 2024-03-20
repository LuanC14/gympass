import { InMemoryCheckInsRepository } from "../../repositories/inMemory/InMemoryCheckInsRepository"
import { CheckInService } from "./CheckInService"
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest"
import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository"
import { Decimal } from "@prisma/client/runtime/library"

let repository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let service: CheckInService

describe('Check In service', () => {

    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        service = new CheckInService(repository, gymsRepository)

        vi.useFakeTimers()

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            latitude: -11.8074901,
            longitude: -42.0650823
        })

    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('deverá ser possível realizar o checkIn', async () => {
        const { checkIn } = await service.createCheckIn({
            gymId: 'gym-01',
            userId: 'user-1',
            userLatitude: -11.8074901,
            userLongitude: -42.0650823
        })
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('não deverá ser possível fazer dois checkIns no mesmo dia', async () => {
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

    it('deverá ser possível realizar checkIns em diferentes dias', async () => {
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

    it('não deverá ser possível realizar o checkIn por conta da distância do usuário em relação a academia', async () => {
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