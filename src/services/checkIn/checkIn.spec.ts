import { InMemoryCheckInsRepository } from "../../repositories/inMemory/InMemoryCheckInsRepository"
import { CheckInService } from "./CheckInService"
import { beforeEach, expect, describe, it, vi, afterEach } from "vitest"
import { InMemoryGymsRepository } from "../../repositories/inMemory/InMemoryGymsRepository"
import { Decimal } from "@prisma/client/runtime/library"
import { MaxDistanceError } from "../../errors/MaxDistanceError"
import { MaxNumberOfCheckInsError } from "../../errors/MaxNumberOfCheckInsError"
import { ResourceNotFoundError } from "../../errors/ResourceNotFoundError"
import { LateCheckInValidationError } from "../../errors/LateCheckInValidationError"

let repository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let service: CheckInService

describe('CheckInService: Create check-in use case', () => {

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

describe('CheckInService: Fetch check-in use case', () => {
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

        const { checkIns } = await service.fecthUserCheckIns({
            userId: 'user-01',
            page: 1
        })

        expect(checkIns).toHaveLength(2)

        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-01' }),
            expect.objectContaining({ gym_id: 'gym-02' })
        ])
    })

    it('Deverá ser possível obter uma lista paginada de check-ins', async () => {

        for (let i = 1; i <= 22; i++) {
            await repository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01'
            })
        }

        const { checkIns } = await service.fecthUserCheckIns({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns).toHaveLength(2)

        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' })
        ])
    })
})

describe('CheckInService: Get User check-in metrics use case', () => {
    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)
    })

    it('deverá ser possível obter a quantidade de check-ins', async () => {
        await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        await repository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        const { checkInsCount } = await service.getUserMetrics({ userId: 'user-01' })

        expect(checkInsCount).toEqual(2)
    })
})

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        repository = new InMemoryCheckInsRepository()
        service = new CheckInService(repository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const { checkIn } = await service.validateCheckIn({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(repository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(() =>
            service.validateCheckIn({
                checkInId: 'inexistent-check-in-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('Não deverá ser possível validar o check-in após 20 minutos da sua criação', async () => {
        vi.setSystemTime(new Date(2024, 0, 1, 19, 30))

        const createdCheckIn = await repository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const twentyOneMinutesInMilliseconds = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMilliseconds)

        await expect(service.validateCheckIn({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(LateCheckInValidationError)


    })
})