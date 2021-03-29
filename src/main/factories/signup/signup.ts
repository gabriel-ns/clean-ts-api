import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usescases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignController = (): Controller => {
  const accountRepository = new AccountMongoRepository()
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(hasher, accountRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(addAccount, validationComposite)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
