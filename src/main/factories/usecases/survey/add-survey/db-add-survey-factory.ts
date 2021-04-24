import { DbAddSurvey } from '../../../../../data/usescases/add-survey/db-add-survey'
import { AddSurvey } from '../../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyRepository = new SurveyMongoRepository()
  const addSurvey = new DbAddSurvey(surveyRepository)
  return addSurvey
}
