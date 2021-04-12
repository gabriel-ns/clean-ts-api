import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeFakeUserData = (): any => ({
  name: 'any_name',
  email: 'any@email.com',
  password: 'any_password'
})

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
    const account = await sut.add(makeFakeUserData())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(makeFakeUserData().name)
    expect(account.email).toBe(makeFakeUserData().email)
    expect(account.password).toBe(makeFakeUserData().password)
  })

  test('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne(makeFakeUserData())
    const account = await sut.loadByEmail('any@email.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(makeFakeUserData().name)
    expect(account.email).toBe(makeFakeUserData().email)
    expect(account.password).toBe(makeFakeUserData().password)
  })

  test('Should return null when loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any@email.com')
    expect(account).toBeNull()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne(makeFakeUserData())
    const dbFakeAccount = res.ops[0]
    expect(dbFakeAccount.accessToken).toBeFalsy()
    await sut.updateAccessToken(dbFakeAccount._id, 'any_token')
    const account = await accountCollection.findOne({ _id: dbFakeAccount._id })
    expect(account).toBeTruthy()
    expect(account.accessToken).toBe('any_token')
  })
})
