import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel, SaveSurveyResultRespository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

const makeFakeSurveyResult = (): SurveyResultModel => {
  return {
    id: 'any_id',
    ...makeFakeSurveyResultData()
  }
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => {
  return {
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  }
}

const makeAddSurveyRepositoryStub = (): SaveSurveyResultRespository => {
  class AddSurveyRepositoryStub implements SaveSurveyResultRespository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }

  return new AddSurveyRepositoryStub()
}

type SutTypes = {
  sut: SaveSurveyResult
  saveSurveyResultRespositoryStub: SaveSurveyResultRespository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRespositoryStub = makeAddSurveyRepositoryStub()
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
    await sut.save(makeFakeSurveyResultData())
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSurveyResultData())
  })

  test('Should throw if SaveSurveyResultRespository throws', async () => {
    const { sut, saveSurveyResultRespositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRespositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
})
