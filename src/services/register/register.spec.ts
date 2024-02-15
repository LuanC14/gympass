import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './registerService'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../repositories/inMemory/InMemoryUsersRepository'
import { UserAlreadyExistsError } from '../../errors/UserAlreadyExistsError'

let usersRepository: InMemoryUsersRepository
let service: RegisterService

describe('Register use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        service = new RegisterService(usersRepository)
    })

    it('Should be able to register', async () => {

        const { user } = await service.registerUser({
            name: 'Vitest Vite',
            email: 'vitest@vite.com',
            password: '123456'
        })
        expect(user.id).toEqual(expect.any(String))
    })

    it('Should hash user password upon registration', async () => {

        const { user } = await service.registerUser({
            name: 'Vitest Vite',
            email: 'vitest@vite.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Should not be able to register with same email twice', async () => {
        const email = 'vitest@vite.com'

        await service.registerUser({
            name: 'Vitest Vite',
            email,
            password: '123456'
        })

        // await necessário identificado via coverage, pelo fato de estar sendo passado um método assíncrono dentro do expect
        await expect(async () => {
            await service.registerUser({
                name: 'Vitest Vite',
                email,
                password: '123456'
            })
        }).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })




})