import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/inMemory/InMemoryUsersRepository'
import { AuthService } from './AuthService'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../../errors/InvalidCredentialsErrors'
import { randomUUID } from 'crypto'

let usersRepository: InMemoryUsersRepository
let service: AuthService

describe('Authenticate use case', async () => {

     beforeEach(async () => {
        usersRepository = new InMemoryUsersRepository()
        service = new AuthService(usersRepository)

        usersRepository.items.push({
            id: randomUUID(),
            name: 'Vitest Vite',
            email: 'vitest@vite.com',
            password_hash: await hash('123456', 6),
            created_at: new Date()
        })
    })

    it('deverá ser possível realizar a autenticação', async () => {

        const { user } = await service.authUser({
            email: 'vitest@vite.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('não deverá ser possível se autenticar com o email errado', async () => {
        await expect(async () => {
            await service.authUser({
                email: 'email@invalido.com',
                password: '123456'
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('não deverá ser possível se autenticar com a senha errada', async () => {

        await expect(async () => {
            await service.authUser({
                email: 'vitest@vite.com',
                password: '123123'
            })
        }).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})