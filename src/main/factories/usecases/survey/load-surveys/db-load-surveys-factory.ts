import { DbLoadSurveys } from '@/data/usescases/load-surveys/db-load-surveys'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyRepository = new SurveyMongoRepository()
  const loadSurveys = new DbLoadSurveys(surveyRepository)
  return loadSurveys
}
