import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/crypto/bcrypt-adapter'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { DbAddAccount } from '../../../../data/usescases/add-account/db-add-account'

export const makeDbAddAccount = (): AddAccount => {
  const accountRepository = new AccountMongoRepository()
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccount = new DbAddAccount(hasher, accountRepository, accountRepository)
  return addAccount
}
