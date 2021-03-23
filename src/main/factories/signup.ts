import { SignUpController } from '../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usescases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/crypto/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignController = (): Controller => {
  const accountRepository = new AccountMongoRepository()
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(encrypter, accountRepository)
  const emailValidator = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidator, addAccount)
  return new LogControllerDecorator(signUpController)
}
