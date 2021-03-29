import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should return a collection if connected', async () => {
    const accountCollection = sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  test('Should reconnect if mongodb is intentionally disconnected', async () => {
    await sut.disconnect()
    const accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  test('Should reconnect if mongodb is accidentally disconnected', async () => {
    await sut.client.close()
    await sut.getCollection('accounts')
    expect(sut.client.isConnected()).toBeTruthy()
  })
})
