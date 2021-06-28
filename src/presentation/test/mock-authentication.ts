import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthToken = (): string => 'any_token'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return new Promise(resolve => resolve(mockAuthToken()))
    }
  }
  return new AuthenticationStub()
}
