import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema'
export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean TS API',
    description: 'API de enquetes do curso do Mango ',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    login: loginParamsSchema,
    error: errorSchema
  }
}
