import { Collection } from 'mongodb'
import { mockAddSurveyParams } from '@/domain/test'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('Add Survey', () => {
    test('Should add a new survey on success', async () => {
      const sut = makeSut()
      const surveyData = mockAddSurveyParams()
      await sut.add(surveyData)
      const survey = await surveyCollection.findOne({ question: surveyData.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('Load All Surveys', () => {
    test('Should return a surveys list', async () => {
      const fakeSurveys = [mockAddSurveyParams(), mockAddSurveyParams()]
      fakeSurveys[1].question = 'other question'
      await surveyCollection.insertMany(fakeSurveys)
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].id).toBeTruthy()
      expect(surveys[0].question).toBe(fakeSurveys[0].question)
      expect(surveys[1].question).toBe(fakeSurveys[1].question)
    })

    test('Should return an empty list if repository is empty', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys).toEqual([])
      expect(surveys.length).toBe(0)
    })
  })

  describe('Load Survey By Id', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const id = res.ops[0]._id
      const sut = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })

    test('Should return null if survey is not found', async () => {
      const sut = makeSut()
      const survey = await sut.loadById('000000000000000000000000')
      expect(survey).toBeNull()
    })
  })
})
