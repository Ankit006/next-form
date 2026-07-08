import * as dayjs from "dayjs"
import {
  containsAll,
  contansSameElement,
  isNumber,
  isNumberArray,
  isString,
  isStringArray,
} from "../utils"
import { EQuestionType } from "./surveyInterface"
import type {
  TAnswer,
  TChoiceCompare,
  TDateTimeCompare,
  TFileCompare,
  TLogicCompares,
  TLogicExpectedValue,
  TNumberCompare,
  TTextInputCompare,
} from "./surveyInterface"

type TEvaluteConditionPayload =
  | {
      type: "QUESTION"
      questionType: EQuestionType
      userAnswer: TAnswer
      expectedValue: TLogicExpectedValue
      compare: TLogicCompares
    }
  | {
      type: "VARIABLE"
      dataType: "string"
      value: string
      expectedValue: string
      compare: TTextInputCompare
    }
  | {
      type: "VARIABLE"
      dataType: "number"
      value: number
      expectedValue: number
      compare: TNumberCompare
    }

const engine = {
  evaluateTextCompare(
    compare: TTextInputCompare,
    answer: string,
    expected: string | Array<string>
  ) {
    switch (compare) {
      case "EQUAL": {
        if (typeof expected !== "string")
          throw new Error("expact string, get array")
        return answer === expected
      }
      case "CONTAINS": {
        if (typeof expected !== "string")
          throw new Error("expact string, get array")
        return answer.includes(expected)
      }
      case "REGEX_MATCH": {
        if (typeof expected !== "string")
          throw new Error("expact string, get array")
        const regExp = new RegExp(expected)
        return regExp.test(answer)
      }
      case "STARTS_WITH": {
        if (typeof expected !== "string")
          throw new Error("expact string, get array")
        return answer.startsWith(expected)
      }
      case "ENDS_WITH": {
        if (typeof expected !== "string")
          throw new Error("expact string, get array")
        return answer.endsWith(expected)
      }
      case "WITHIN": {
        if (!isStringArray(expected))
          throw new Error("expect string array, get string")
        return expected.includes(answer)
      }
      default: {
        throw new Error("unxpected compare provided")
      }
    }
  },

  evaluteChoiceCompare(
    compare: TChoiceCompare,
    answer: Array<string> | Array<number>,
    expected: Array<string> | Array<number>
  ) {
    switch (compare) {
      case "EQUAL": {
        return contansSameElement<string | number>(answer, expected)
      }

      case "WITHIN": {
        return containsAll<string | number>(answer, expected)
      }

      case "NOT_WITHIN": {
        return !containsAll<string | number>(answer, expected)
      }
      default: {
        throw new Error("unxpected compare provided")
      }
    }
  },

  evaluateNumberCompare(
    compare: TNumberCompare,
    answer: number,
    expected: number | Array<number>
  ) {
    switch (compare) {
      case "EQUAL": {
        if (!isNumber(expected))
          throw new Error(`got ${typeof expected}, expect number`)
        return answer === expected
      }

      case "GREATER": {
        if (!isNumber(expected))
          throw new Error(`got ${typeof expected}, expect number`)

        return answer > expected
      }

      case "GREATER_THAN_EQUAL": {
        if (!isNumber(expected))
          throw new Error(`got ${typeof expected}, expect number`)
        return answer >= expected
      }
      case "LESSER": {
        if (!isNumber(expected))
          throw new Error(`got ${typeof expected}, expect number`)
        return answer < expected
      }

      case "LESSER_THAN_EQUAL": {
        if (!isNumber(expected))
          throw new Error(`got ${typeof expected}, expect number`)
        return answer <= expected
      }

      case "WITHIN": {
        if (!isNumberArray(expected))
          throw new Error(`got ${typeof expected}, expect number array`)
        return expected.includes(answer)
      }

      default: {
        throw new Error("unxpected compare provided")
      }
    }
  },

  evaluateDateCompare(compare: TDateTimeCompare, answer: Date, expected: Date) {
    switch (compare) {
      case "AFTER": {
        return dayjs(answer).isAfter(expected)
      }
      case "AFTER_OR_EQUALS": {
        const dayInst = dayjs(answer)
        return dayInst.isAfter(expected) || dayInst.isSame(expected)
      }
      case "BEFORE": {
        return dayjs(answer).isBefore(expected)
      }
      case "BEFORE_OR_EQUALS": {
        const dayInst = dayjs(answer)
        return dayInst.isBefore(expected) || dayInst.isSame(expected)
      }
      case "EQUALS": {
        return dayjs(answer).isSame(expected)
      }
      case "NOT_EQUAL": {
        return !dayjs(answer).isSame(expected)
      }
      default: {
        throw new Error("unxpected compare provided")
      }
    }
  },

  evaluateFileCOmpare(compare: TFileCompare, answer: Array<File>) {
    switch (compare) {
      case "IS_EMPTY": {
        return answer.length === 0
      }
      case "IS_NOT_EMPTY": {
        return answer.length !== 0
      }
      default: {
        throw new Error("unxpected compare provided")
      }
    }
  },

  evaluateCondition(params: TEvaluteConditionPayload) {
    if (params.type === "QUESTION") {
      switch (params.questionType) {
        case EQuestionType.TEXT_INPUT: {
          if (params.compare.questionType !== EQuestionType.TEXT_INPUT) {
            throw new Error("compare questionType mistmatch")
          }
          const compare = params.compare.comparison
          if (params.userAnswer.questionType !== EQuestionType.TEXT_INPUT) {
            throw new Error("userAnswer questionType mismatch")
          }
          const answer = params.userAnswer.value
          if (
            !isStringArray(params.expectedValue) &&
            !isString(params.expectedValue)
          ) {
            throw new Error("only string or array string accepted")
          }
          return this.evaluateTextCompare(compare, answer, params.expectedValue)
        }

        case EQuestionType.NUMBER_INPUT: {
          if (params.compare.questionType !== EQuestionType.NUMBER_INPUT) {
            throw new Error("compare questionType mismatch")
          }
          const compare = params.compare.comparison

          if (params.userAnswer.questionType !== EQuestionType.NUMBER_INPUT) {
            throw new Error("userAnswer question type mismatch")
          }
          const answer = params.userAnswer.value
          if (
            !isNumberArray(params.expectedValue) &&
            !isNumber(params.expectedValue)
          ) {
            throw new Number("only number and array of number expected")
          }

          return this.evaluateNumberCompare(
            compare,
            answer,
            params.expectedValue
          )
        }
      }
    }
  },
}

export default engine
