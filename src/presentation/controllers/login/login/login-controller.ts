import { Validation, HttpRequest, Authentication, HttpResponse, Controller } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const authentication = await this.authentication.auth({
        email,
        password
      })
      if (!authentication) {
        return unauthorized()
      }
      return ok(authentication)
    } catch (error) {
      return serverError(new Error())
    }
  }
}
