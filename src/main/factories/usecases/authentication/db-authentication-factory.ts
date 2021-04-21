import env from '../../../config/env'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/crypto/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/crypto/jwt-adapter/jwt-adapter'
import { Authentication } from '../../../../domain/usecases/authentication'
import { DbAuthentication } from '../../../../data/usescases/authentication/db-authentication'

export const makeDbAuthentication = (): Authentication => {
  const accountRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbAuthentication = new DbAuthentication(accountRepository, bcryptAdapter, jwtAdapter, accountRepository)
  return dbAuthentication
}
