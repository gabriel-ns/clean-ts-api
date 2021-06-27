import { DbSaveSurveyResult } from '@/data/usescases/survey-result/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultRepository)
}
