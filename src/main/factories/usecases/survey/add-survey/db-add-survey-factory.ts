import { DbAddSurvey } from '@/data/usescases/survey/add-survey/db-add-survey'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyRepository = new SurveyMongoRepository()
  const addSurvey = new DbAddSurvey(surveyRepository)
  return addSurvey
}
