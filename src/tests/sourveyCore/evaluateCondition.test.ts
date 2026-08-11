import { describe, expect, it } from "vitest"
import { evaluateCondition } from "@/lib/SurveyCore/engineEvaluationLogic"
import {
  EQuestionType,
  type TAnswer,
  type TLogicCompares,
  type TLogicExpectedValue,
} from "@/lib/SurveyCore/surveyInterface"

describe("evaluateCondition ->  TEXT_INPUT", () => {
  const userAnswer: TAnswer = {
    questionType: EQuestionType.TEXT_INPUT,
    value: "Hello World!",
  }

  it("EQUAL", () => {
    const expectedValue: TLogicExpectedValue = "Hello World!"
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "EQUAL",
    }

    const result = evaluateCondition({
      type: "QUESTION",
      userAnswer,
      expectedValue,
      compare,
      questionType: EQuestionType.TEXT_INPUT,
    })
    expect(result).toBe(true)
  })

  it("CONTAINS", () => {
    const expectedValue: TLogicExpectedValue = "World"
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "CONTAINS",
    }

    const result = evaluateCondition({
      type: "QUESTION",
      userAnswer,
      expectedValue,
      compare,
      questionType: EQuestionType.TEXT_INPUT,
    })
    expect(result).toBe(true)
  })

  it("STARTS_WITH", () => {
    const expectedValue: TLogicExpectedValue = "Hel"
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "STARTS_WITH",
    }
    const result = evaluateCondition({
      type: "QUESTION",
      userAnswer,
      expectedValue,
      compare,
      questionType: EQuestionType.TEXT_INPUT,
    })

    expect(result).toBe(true)
  })

  it("ENDS_WITH", () => {
    const expectedValue: TLogicExpectedValue = "rld!"
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "ENDS_WITH",
    }
    const result = evaluateCondition({
      type: "QUESTION",
      questionType: EQuestionType.TEXT_INPUT,
      userAnswer,
      expectedValue,
      compare,
    })
    expect(result).toBe(true)
  })
  it("REGEX_MATCH", () => {
    const expectedValue: TLogicExpectedValue = "[A-Z]"
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "REGEX_MATCH",
    }
    const result = evaluateCondition({
      type: "QUESTION",
      questionType: EQuestionType.TEXT_INPUT,
      userAnswer,
      expectedValue,
      compare,
    })

    expect(result).toBe(true)
  })

  it("WITHIN", () => {
    const expectedValue: TLogicExpectedValue = [
      "Hello World!",
      "New World",
      "Forth Mission",
    ]
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "WITHIN",
    }

    const result = evaluateCondition({
      type: "QUESTION",
      questionType: EQuestionType.TEXT_INPUT,
      userAnswer,
      expectedValue,
      compare,
    })
    expect(result).toBe(true)
  })
})
