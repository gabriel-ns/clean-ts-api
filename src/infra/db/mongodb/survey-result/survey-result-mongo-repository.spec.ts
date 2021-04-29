import { SaveSurveyResultRespository, SurveyResultModel } from '@/data/usescases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'
import { AddAccountModel } from '@/domain/usecases/account/add-account'
import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveysCollection: Collection
let accountsCollection: Collection
let surveysResultCollection: Collection

const makeFakeUserData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any@email.com',
  password: 'any_password'
})

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer',
    image: 'any_image'
  }],
  date: new Date()
})

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountsCollection.insertOne(makeFakeUserData())
  return MongoHelper.map(res.ops[0])
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveysCollection.insertOne(makeFakeSurveyData())
  return MongoHelper.map(res.ops[0])
}

const makeSut = (): SaveSurveyResultRespository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    accountsCollection = await MongoHelper.getCollection('accounts')
    surveysResultCollection = await MongoHelper.getCollection('surveyResults')
    await accountsCollection.deleteMany({})
    await surveysResultCollection.deleteMany({})
    await surveysCollection.deleteMany({})
  })

  describe('Save Survey Result', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()
      const res = await surveysResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const existingSurveyResult = MongoHelper.map(res.ops[0]) as SurveyResultModel

      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(existingSurveyResult.id)
    })
  })
})
