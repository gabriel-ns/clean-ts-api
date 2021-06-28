import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResult, SaveSurveyResultRespository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'
import { mockSaveSurveyResultRespository } from '@/data/test'

type SutTypes = {
  sut: SaveSurveyResult
  saveSurveyResultRespositoryStub: SaveSurveyResultRespository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRespositoryStub = mockSaveSurveyResultRespository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRespositoryStub)
  return {
    saveSurveyResultRespositoryStub,
    sut
  }
}

describe('DbSaveSurveyResult', () => {
  let mockDate: Date
  beforeAll(() => {
    mockDate = new Date()
    MockDate.set(mockDate)
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRespository with correct values', async () => {
    const { sut, saveSurveyResultRespositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRespositoryStub, 'save')
    await sut.save(mockSaveSurveyResultParams())
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should throw if SaveSurveyResultRespository throws', async () => {
    const { sut, saveSurveyResultRespositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRespositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
