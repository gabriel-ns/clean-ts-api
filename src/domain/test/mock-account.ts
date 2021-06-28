import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any@email.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: mockAddAccountParams().name,
  email: mockAddAccountParams().email,
  password: 'hashed_password'
})

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any@email.com',
  password: 'any_password'
})
