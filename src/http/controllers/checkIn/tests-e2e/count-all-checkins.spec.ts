import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { app } from "../../../../app"
import { prisma } from "../../../../lib/prisma"

describe('Count all checkins', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

  it('should be able to get the total count of check-ins', async () => {
        await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const authResponse = await request(app.server).post('/auth').send({
            email: 'johndoe@example.com',
            password: '123456',
        })

        const { token } = authResponse.body

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -27.2092052,
                longitude: -49.6401091,
            },
        })

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
            ],
        })

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.checkInsCount).toEqual(2)
    })
})