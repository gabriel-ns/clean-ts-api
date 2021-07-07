import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResults {
  load (surveyId: string): Promise<SurveyResultModel>
}
