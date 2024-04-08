import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '../../../app'

describe('UserController (e2e)', () => {
    beforeAll(async () => {
      await app.ready()
    })
  
    afterAll(async () => {
      await app.close()
    })
  
    it('should be able to register', async () => {
      const response = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
  
      expect(response.statusCode).toEqual(201)
    })

    it('should be able to get user profile', async () => {
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

  
      const profileResponse = await request(app.server)
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(profileResponse.statusCode).toEqual(200)
      expect(profileResponse.body).toEqual(
        expect.objectContaining({
          email: 'johndoe@example.com',
        }),
      )
    })
  })