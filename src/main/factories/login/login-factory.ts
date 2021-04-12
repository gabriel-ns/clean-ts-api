import env from '../../config/env'
import { makeLoginValidation } from './login-validation-factory'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

import { Controller } from '../../../presentation/protocols'
import { LoginController } from '../../../presentation/controllers/login/login-controller'

import { DbAuthentication } from '../../../data/usescases/authentication/db-authentication'

import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BcryptAdapter } from '../../../infra/crypto/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/crypto/jwt-adapter/jwt-adapter'

export const makeLoginController = (): Controller => {
  const accountRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository)
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(validationComposite, dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
