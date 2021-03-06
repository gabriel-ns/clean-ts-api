import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

describe('Login routes', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('Should return 200 on login success', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any@mail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'any@mail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 when user is not found', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any@mail.com',
          password: '123'
        })
        .expect(401)
    })

    test('Should return 401 when password does not match', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any@mail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'any@mail.com',
          password: '123456'
        })
        .expect(401)
    })
  })
})
