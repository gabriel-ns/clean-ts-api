import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

export interface SaveSurveyResultRespository {
  save (data: SaveSurveyResultModel): Promise<SurveyResultModel>
}
