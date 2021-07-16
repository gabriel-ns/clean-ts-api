import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/data/usescases/survey-result/load-survey-result/db-load-survey-result-protocols'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

export const mockSurveyResultModel = (): SurveyResultModel => {
  return {
    surveyId: 'any_survey_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      count: 1,
      percent: 10,
      isCurrentAnswer: false
    }, {
      answer: 'other_answer',
      image: 'any_image',
      count: 9,
      percent: 90,
      isCurrentAnswer: false
    }],
    date: new Date()
  }
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultStub()
}
