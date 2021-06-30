import { Express } from 'express'
import { bodyParser, contentType, cors, noCache } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(noCache)
}
