import { SaveSurveyResultParams, SaveSurveyResultRespository, SurveyResultModel } from '@/data/usescases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '../helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRespository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveysResultCollection = await MongoHelper.getCollection('surveyResults')
    const { surveyId, accountId, answer, date } = data
    await surveysResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: {
        answer,
        date
      }
    }, {
      upsert: true
    })
    const surveyResult = await this.loadBySurveyId(surveyId)
    console.log(surveyResult)
    return surveyResult
  }

  private async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveysResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({ surveyId: new ObjectId(surveyId) })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        count: {
          $sum: 1
        }
      })
      .unwind({ path: '$data' })
      .lookup({
        from: 'surveys',
        localField: 'data.surveyId',
        foreignField: '_id',
        as: 'survey'
      })
      .unwind({ path: '$survey' })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: [
                  '$$item.answer', '$data.answer'
                ]
              }
            }
          }
        },
        count: {
          $sum: 1
        }
      })
      .unwind({ path: '$_id.answer' })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: [
                '$count', '$_id.total'
              ]
            }, 100
          ]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: {
          $push: '$_id.answer'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const surveyResult = await surveysResultCollection.aggregate(query).toArray()
    return surveyResult?.length ? surveyResult[0] : null
  }
}
