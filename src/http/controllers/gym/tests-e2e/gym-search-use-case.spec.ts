import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../../../app";
import { createAndAuthenticateUser } from '../../../../utils/tests/create-and-authenticate-user';

describe('GymController:e2e - Search gym by title use case', async () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gyms by title', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Javascript Gym',
                description: 'Some description.',
                phone: '1199999999',
                latitude: -27.2092052,
                longitude: -49.6401091,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description.',
                phone: '1199999999',
                latitude: -27.2092052,
                longitude: -49.6401091,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({
                q: 'Type',
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        console.log(response.body)

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'TypeScript Gym',
            }),
        ])
    })
})