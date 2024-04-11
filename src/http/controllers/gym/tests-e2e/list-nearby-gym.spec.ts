import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { app } from "../../../../app"
import { createAndAuthenticateUser } from "../../../../utils/tests/create-and-authenticate-user"

describe('GymController:e2e: Search nearby gym use case', () => { 
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

   it('should be able list nearby gyms', async () => {
        const {token} = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description.',
                phone: '1199999999',
                latitude: -27.3092052,
                longitude: -49.7401091,
            })

            await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'CSS Gym',
                description: 'Some description.',
                phone: '1199999999',
                latitude: -33.3092052,
                longitude: -49.7401091,
            })


        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -27.3092052,
                longitude: -49.7401091,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym',
            }),
        ])
    })


 })