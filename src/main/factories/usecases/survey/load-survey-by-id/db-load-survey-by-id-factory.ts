import { DbLoadSurveyById } from '@/data/usescases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyRepository)
}
