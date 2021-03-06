import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usescases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '../helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<void> {
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
  }

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveysResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new QueryBuilder()
      .match({ surveyId: new ObjectId(surveyId) })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
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
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        },
        currentAnswer: {
          $push: {
            $cond: [{ $eq: ['$data.accountId', accountId] }, '$data.answer', null]
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: ['$$item', {
                count: {
                  $cond: {
                    if: {
                      $eq: ['$$item.answer', '$_id.answer']
                    },
                    then: '$count',
                    else: 0
                  }
                },
                percent: {
                  $cond: {
                    if:
                    { $eq: ['$$item.answer', '$_id.answer'] },
                    then: {
                      $multiply: [{
                        $divide: ['$count', '$_id.total']
                      }, 100]
                    },
                    else: 0
                  }
                },
                isCurrentAnswer: {
                  $eq: ['$$item.answer', { $arrayElemAt: ['$currentAnswer', 0] }]
                }
              }]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({ path: '$answers' })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
          isCurrentAnswer: '$answers.isCurrentAnswer'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: { $round: ['$percent'] },
          isCurrentAnswer: '$_id.isCurrentAnswer'
        }
      })
      .sort({ 'answer.count': -1 })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
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
    return surveyResult.length ? surveyResult[0] : null
  }
}
