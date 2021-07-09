import { AuthenticationModel } from '@/domain/models/authentication'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: 'any_token',
  name: 'any_name'
})

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return new Promise(resolve => resolve(mockAuthenticationModel()))
    }
  }
  return new AuthenticationStub()
}
