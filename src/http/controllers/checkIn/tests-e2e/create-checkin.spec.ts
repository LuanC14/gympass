import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { app } from "../../../../app"
import { prisma } from "../../../../lib/prisma"
import { createAndAuthenticateUser } from "../../../../utils/tests/create-and-authenticate-user"

describe('Create CheckIn', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a check-in', async () => {

        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript1 Gym',
                latitude: -27.2092052,
                longitude: -49.6401091,
            },
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -27.2092052,
                longitude: -49.6401091,
            })

        expect(response.statusCode).toEqual(201)
    })

})