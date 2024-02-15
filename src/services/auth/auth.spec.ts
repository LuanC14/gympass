import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/inMemory/InMemoryUsersRepository'
import { AuthService } from './AuthService'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../../errors/InvalidCredentialsErrors'

let usersRepository: InMemoryUsersRepository
let service: AuthService

describe('Authenticate use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        service = new AuthService(usersRepository)
    })

    it('Should be able to authenticate', async () => {

        await usersRepository.create({
            name: 'Vitest Vite',
            email: 'vitest@vite.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await service.authUser({
            email: 'Vitest Vite',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('Should not be able to authenticate with wrong email', async () => {
        await expect(async () => {
            await service.authUser({
                email: 'Vitest Vite',
                password: '123456'
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('Should not be able to authenticate with wrong password', async () => {

        await usersRepository.create({
            name: 'Vitest Vite',
            email: 'vitest@vite.com',
            password_hash: await hash('123456', 6)
        })

        await expect(async () => {
            await service.authUser({
                email: 'vitest@vite.com',
                password: '123123'
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})