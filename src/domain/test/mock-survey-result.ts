import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'

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
      percent: 10
    }, {
      answer: 'other_answer',
      image: 'any_image',
      count: 9,
      percent: 90
    }],
    date: new Date()
  }
}
