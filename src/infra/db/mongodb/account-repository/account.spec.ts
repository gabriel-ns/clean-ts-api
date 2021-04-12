import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
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

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    const userFakeAccount = {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    }
    await accountCollection.insertOne(userFakeAccount)
    const account = await sut.loadByEmail('any@email.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any@email.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return null when loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any@email.com')
    expect(account).toBeNull()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const userFakeAccountData = {
      name: 'any_name',
      email: 'any@email.com',
      password: 'any_password'
    }
    const res = await accountCollection.insertOne(userFakeAccountData)
    const dbFakeAccount = res.ops[0]
    expect(dbFakeAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(dbFakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({ _id: dbFakeAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
