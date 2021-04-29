import { SaveSurveyResultModel, SaveSurveyResultRespository, SurveyResultModel } from '@/data/usescases/save-survey-result/db-save-survey-result-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRespository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveysResultCollection = await MongoHelper.getCollection('surveyResults')
    const { surveyId, accountId, answer, date } = data
    const res = await surveysResultCollection.findOneAndUpdate({
      surveyId,
      accountId
    }, {
      $set: {
        answer,
        date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })
    return res.value && MongoHelper.map(res.value)
  }
}
