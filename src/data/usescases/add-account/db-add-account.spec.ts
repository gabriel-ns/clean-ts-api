import { AddAccountModel } from '../../../domain/usecases/add-account'
import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }

    const encypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encypterStub)
    const encryptSpy = jest.spyOn(encypterStub, 'encrypt')
    const accountData: AddAccountModel = {
      name: 'any_name',
      email: 'valid@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
