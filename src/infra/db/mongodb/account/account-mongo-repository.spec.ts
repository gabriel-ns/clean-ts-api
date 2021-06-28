import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { mockAddAccountParams } from '@/domain/test'
import { AccountMongoRepository } from './account-mongo-repository'

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

  describe('AddAccountRepository', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(mockAddAccountParams())
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })
  })

  describe('LoadAccountByEmailRepository', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())
      const account = await sut.loadByEmail('any@email.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })

    test('Should return null when loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any@email.com')
      expect(account).toBeNull()
    })
  })

  describe('UpdateAccessTokenRepository', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())
      const dbFakeAccount = res.ops[0]
      expect(dbFakeAccount.accessToken).toBeFalsy()
      await sut.updateAccessToken(dbFakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: dbFakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('LoadAccountByTokenRepository', () => {
    test('Should return an account on loadByToken without role success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })

    test('Should return an account on loadByToken with admin role success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })

    test('Should return an account on loadByToken with invalid role success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(mockAddAccountParams().name)
      expect(account.email).toBe(mockAddAccountParams().email)
      expect(account.password).toBe(mockAddAccountParams().password)
    })

    test('Should return null when loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeNull()
    })
  })
})
