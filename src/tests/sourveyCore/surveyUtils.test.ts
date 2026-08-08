import { describe, expect, it } from "vitest"
import { EQuestionType } from "@/lib/SurveyCore/surveyInterface"
import {
  createQuestionDefaultConfig,
  getLogicalCompare,
  getLogicalCompareForVariable,
  getLogicalCompareListForQuestion,
  getLogicalCompareListForVariable,
} from "@/lib/SurveyCore/surveyUtils"

describe("test creatreQuestionDefaultConfig", () => {
  it("should return correct default values for DATE config", () => {
    const config = createQuestionDefaultConfig(EQuestionType.DATE)
    if (config.type !== EQuestionType.DATE) throw new Error("expected DATE")
    expect(config.rangeDate).toBe(false)
    expect(config.required).toBe(false)
    expect(config.hidden).toBe(false)
    expect(config.disabled).toBe(false)
  })

  it("should default hour24 to false for TIME config", () => {
    const config = createQuestionDefaultConfig(EQuestionType.TIME)
    if (config.type !== EQuestionType.TIME) throw new Error("expected TIME")
    expect(config.hour24).toBe(false)
    expect(config.required).toBe(false)
    expect(config.hidden).toBe(false)
  })

  it("should default both rangeDate and hour24 to false for DATE_TIME config", () => {
    const config = createQuestionDefaultConfig(EQuestionType.DATE_TIME)
    if (config.type !== EQuestionType.DATE_TIME)
      throw new Error("expected DATE_TIME")
    expect(config.rangeDate).toBe(false)
    expect(config.hour24).toBe(false)
    expect(config.required).toBe(false)
    expect(config.hidden).toBe(false)
  })

  it("should default count to 5 for RATING config", () => {
    const config = createQuestionDefaultConfig(EQuestionType.RATING)
    if (config.type !== EQuestionType.RATING) throw new Error("expected RATING")
    expect(config.count).toBe(5)
    expect(config.required).toBe(false)
  })

  it("should default shuffle enable to false for MATRIX_SINGLE_CHOICE config", () => {
    const config = createQuestionDefaultConfig(
      EQuestionType.MATRIX_SINGLE_CHOICE,
    )
    if (config.type !== EQuestionType.MATRIX_SINGLE_CHOICE)
      throw new Error("expected MATRIX_SINGLE_CHOICE")
    expect(config.shuffleRow.enable).toBe(false)
    expect(config.shuffleColumn.enable).toBe(false)
    expect(config.required).toBe(false)
  })

  it("should default shuffle enable to false for MATRIX_MULTI_CHOICE config", () => {
    const config = createQuestionDefaultConfig(
      EQuestionType.MATRIX_MULTI_CHOICE,
    )
    if (config.type !== EQuestionType.MATRIX_MULTI_CHOICE)
      throw new Error("expected MATRIX_MULTI_CHOICE")
    expect(config.shuffleRow.enable).toBe(false)
    expect(config.shuffleColumn.enable).toBe(false)
    expect(config.required).toBe(false)
  })

  it("should default multiline to false for TEXT_INPUT config", () => {
    const config = createQuestionDefaultConfig(EQuestionType.TEXT_INPUT)
    if (config.type !== EQuestionType.TEXT_INPUT)
      throw new Error("expected TEXT_INPUT")
    expect(config.multiline).toBe(false)
    expect(config.required).toBe(false)
    expect(config.hidden).toBe(false)
  })

  it("should throw for invalid question type", () => {
    expect(() =>
      createQuestionDefaultConfig("INVALID_TYPE" as EQuestionType),
    ).toThrow("wrong question type")
  })
})

describe("test getLogicalCompare", () => {
  // TEXT_INPUT
  it("return obj should contains text input type and TTextInputCompare comparison", () => {
    const compareObj = getLogicalCompare(EQuestionType.TEXT_INPUT, "EQUAL")
    expect(compareObj.questionType).toBe(EQuestionType.TEXT_INPUT)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.TEXT_INPUT,
    )

    expect(allowCompareList).toContain(compareObj.comparison)
  })
  it("return error when invalid compare provided for TEXT_INPUT", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.TEXT_INPUT, "GREATER"),
    ).toThrow("invalid logical compare provided for text input")
  })

  // NUMBER_INPUT
  it("should return correct obj for NUMBER_INPUT", () => {
    const compareObj = getLogicalCompare(EQuestionType.NUMBER_INPUT, "GREATER")
    expect(compareObj.questionType).toBe(EQuestionType.NUMBER_INPUT)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.NUMBER_INPUT,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on NUMBER_INPUT", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.NUMBER_INPUT, "CONTAINS"),
    ).toThrow("wrong compare provided for number input")
  })

  // RATING
  it("should return correct obj for RATING", () => {
    const compareObj = getLogicalCompare(EQuestionType.RATING, "EQUAL")
    expect(compareObj.questionType).toBe(EQuestionType.RATING)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.RATING,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on RATING", () => {
    expect(() => getLogicalCompare(EQuestionType.RATING, "CONTAINS")).toThrow(
      "wrong compare provided for rating",
    )
  })

  // DATE
  it("should return correct obj for DATE", () => {
    const compareObj = getLogicalCompare(EQuestionType.DATE, "BEFORE")
    expect(compareObj.questionType).toBe(EQuestionType.DATE)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.DATE,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on DATE", () => {
    expect(() => getLogicalCompare(EQuestionType.DATE, "CONTAINS")).toThrow(
      "wrong compare provided fro date input",
    )
  })

  // DATE_TIME
  it("should return correct obj for DATE_TIME", () => {
    const compareObj = getLogicalCompare(EQuestionType.DATE_TIME, "AFTER")
    expect(compareObj.questionType).toBe(EQuestionType.DATE_TIME)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.DATE_TIME,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on DATE_TIME", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.DATE_TIME, "CONTAINS"),
    ).toThrow("wrong compare provided for date time input")
  })

  // TIME
  it("should return correct obj for TIME", () => {
    const compareObj = getLogicalCompare(EQuestionType.TIME, "EQUALS")
    expect(compareObj.questionType).toBe(EQuestionType.TIME)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.TIME,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on TIME", () => {
    expect(() => getLogicalCompare(EQuestionType.TIME, "CONTAINS")).toThrow(
      "wrong compare provided for time input",
    )
  })

  // SINGLE_CHOICE
  it("should return correct obj for SINGLE_CHOICE", () => {
    const compareObj = getLogicalCompare(EQuestionType.SINGLE_CHOICE, "EQUAL")
    expect(compareObj.questionType).toBe(EQuestionType.SINGLE_CHOICE)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.SINGLE_CHOICE,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on SINGLE_CHOICE", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.SINGLE_CHOICE, "CONTAINS"),
    ).toThrow("wrong compare provided for single choice input")
  })

  // MULTIPLE_CHOICE
  it("should return correct obj for MULTIPLE_CHOICE", () => {
    const compareObj = getLogicalCompare(
      EQuestionType.MULTIPLE_CHOICE,
      "WITHIN",
    )
    expect(compareObj.questionType).toBe(EQuestionType.MULTIPLE_CHOICE)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.MULTIPLE_CHOICE,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on MULTIPLE_CHOICE", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.MULTIPLE_CHOICE, "CONTAINS"),
    ).toThrow("wrong choice provided for multi choice input")
  })

  // MATRIX_SINGLE_CHOICE
  it("should return correct obj for MATRIX_SINGLE_CHOICE", () => {
    const compareObj = getLogicalCompare(
      EQuestionType.MATRIX_SINGLE_CHOICE,
      "EQUAL",
    )
    expect(compareObj.questionType).toBe(EQuestionType.MATRIX_SINGLE_CHOICE)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.MATRIX_SINGLE_CHOICE,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on MATRIX_SINGLE_CHOICE", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.MATRIX_SINGLE_CHOICE, "CONTAINS"),
    ).toThrow("wrong choice provided for matrix single input")
  })

  // MATRIX_MULTI_CHOICE
  it("should return correct obj for MATRIX_MULTI_CHOICE", () => {
    const compareObj = getLogicalCompare(
      EQuestionType.MATRIX_MULTI_CHOICE,
      "NOT_WITHIN",
    )
    expect(compareObj.questionType).toBe(EQuestionType.MATRIX_MULTI_CHOICE)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.MATRIX_MULTI_CHOICE,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on MATRIX_MULTI_CHOICE", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.MATRIX_MULTI_CHOICE, "CONTAINS"),
    ).toThrow("wrong choice provided for matrix multi input")
  })

  // FILE_UPLOAD
  it("should return correct obj for FILE_UPLOAD", () => {
    const compareObj = getLogicalCompare(EQuestionType.FILE_UPLOAD, "IS_EMPTY")
    expect(compareObj.questionType).toBe(EQuestionType.FILE_UPLOAD)
    const allowCompareList = getLogicalCompareListForQuestion(
      EQuestionType.FILE_UPLOAD,
    )
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on FILE_UPLOAD", () => {
    expect(() =>
      getLogicalCompare(EQuestionType.FILE_UPLOAD, "CONTAINS"),
    ).toThrow("Wrong compare provided for File uplaod field")
  })

  // invalid type
  it("should throw for invalid question type", () => {
    expect(() =>
      getLogicalCompare("INVALID_TYPE" as EQuestionType, "EQUAL"),
    ).toThrow("Provide valid types")
  })
})

describe("test getLogicalCompareForVariable", () => {
  it("should return correct obj for string variable", () => {
    const compareObj = getLogicalCompareForVariable("string", "EQUAL")
    expect(compareObj.questionType).toBe("VARIABLE")
    const allowCompareList = getLogicalCompareListForVariable("string")
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on string variable", () => {
    expect(() => getLogicalCompareForVariable("string", "GREATER")).toThrow(
      "wrong compare provided for string variable",
    )
  })

  it("should return correct obj for number variable", () => {
    const compareObj = getLogicalCompareForVariable("number", "GREATER")
    expect(compareObj.questionType).toBe("VARIABLE")
    const allowCompareList = getLogicalCompareListForVariable("number")
    expect(allowCompareList).toContain(compareObj.comparison)
  })

  it("should throw for invalid compare on number variable", () => {
    expect(() => getLogicalCompareForVariable("number", "CONTAINS")).toThrow(
      "wrong compare provided for number variable",
    )
  })
})
