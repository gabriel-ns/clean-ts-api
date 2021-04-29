import { AccountModel } from '@/data/usescases/account/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel>
}
