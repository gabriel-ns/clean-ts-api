import request from 'supertest'
import app from '../config/app'

describe('Sign up routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any@mail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
