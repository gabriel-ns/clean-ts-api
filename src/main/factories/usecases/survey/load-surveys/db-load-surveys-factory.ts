import { DbLoadSurveys } from '@/data/usescases/survey/load-surveys/db-load-surveys'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyRepository = new SurveyMongoRepository()
  const loadSurveys = new DbLoadSurveys(surveyRepository)
  return loadSurveys
}
