import { SaveSurveyResult, SurveyResultModel, SaveSurveyResultModel, SaveSurveyResultRespository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRespository: SaveSurveyResultRespository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const result = await this.saveSurveyResultRespository.save(data)
    return result
  }
}
