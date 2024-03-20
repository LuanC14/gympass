import { InMemoryCheckInsRepository } from "../../repositories/inMemory/InMemoryCheckInsRepository"
import { CheckInService } from "./CheckInService"
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest"
import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository"
import { Decimal } from "@prisma/client/runtime/library"
import { MaxDistanceError } from "../../errors/MaxDistanceError"
import { MaxNumberOfCheckInsError } from "../../errors/MaxNumberOfCheckInsError"

let repository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let service: CheckInService

describe('CheckInService: Create Check-in use case', () => {

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
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
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
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})

describe('CheckInService: Fetch Check-in use case', () => {
    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)
    })

    it('Deverá ser possível obter uma lista de check-ins', async () => {

        await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        await repository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        const { checkIns } = await service.FecthUserCheckIns({
            userId: 'user-01',
            page: 1
        })

        expect(checkIns).toHaveLength(2)

        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-01'}),
            expect.objectContaining({gym_id: 'gym-02'})
        ])
    })

    it('Deverá ser possível obter uma lista paginada de check-ins', async () => {

        for(let i = 1; i <= 22; i++) {
            await repository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01'
            })
        }

        const { checkIns } = await service.FecthUserCheckIns({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns).toHaveLength(2)

        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-21'}),
            expect.objectContaining({gym_id: 'gym-22'})
        ])
    })
})