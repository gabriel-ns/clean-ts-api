import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-results/save-survey-result/save-survey-result-factory'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-results/load-survey-result/load-survey-result-factory'
import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}
