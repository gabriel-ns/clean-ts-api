import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { password, name, email } = httpRequest.body
      const account = await this.addAccount.add({
        email,
        name,
        password
      })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const authentication = await this.authentication.auth({
        email,
        password
      })
      return ok(authentication)
    } catch (error) {
      return serverError(error)
    }
  }
}
