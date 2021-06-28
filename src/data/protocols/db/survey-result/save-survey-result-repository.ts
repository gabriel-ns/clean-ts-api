import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRespository {
  save (data: SaveSurveyResultParams): Promise<SurveyResultModel>
}
