import dayjs from "dayjs"
import {
  containsAll,
  containsSameElement,
  isNumber,
  isNumberArray,
  isString,
  isStringArray,
} from "../utils"
import { EQuestionType } from "./surveyInterface"
import {
  isMatrixArrayContainsSame,
  isMatrixSubValueList,
  isMatrixValueArray,
} from "./surveyUtils"
import type {
  TAnswer,
  TChoiceCompare,
  TDateTimeCompare,
  TFileCompare,
  TLogicCompares,
  TLogicExpectedValue,
  TMatrixCompare,
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
        return containsSameElement<string | number>(answer, expected)
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

  evaluateDateCompare(
    compare: TDateTimeCompare,
    answer: string,
    expected: string
  ) {
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

  evaluateMatrixSingleChoice(
    compare: TMatrixCompare,
    userAnswer: { rowId: string; columnId: string },
    expectedAnswer:
      | { rowId: string; columnId: string }
      | Array<{ rowId: string; columnId: string }>
  ) {
    switch (compare) {
      case "ROW_COLUMN_EQUAL": {
        if (Array.isArray(expectedAnswer))
          throw new Error("exptedAnswer must object, got array")

        return (
          userAnswer.rowId === expectedAnswer.rowId &&
          userAnswer.columnId === expectedAnswer.columnId
        )
      }
      case "ROW_COLUMN_WITHIN": {
        if (!isMatrixValueArray(expectedAnswer))
          throw new Error("expectedAnswer must be an array")
        return expectedAnswer.some(
          (val) =>
            val.rowId === userAnswer.rowId &&
            val.columnId === userAnswer.columnId
        )
      }
      case "ROW_COLUMN_NOT_WITHIN": {
        if (!isMatrixValueArray(expectedAnswer))
          throw new Error("expectedAnswer must be an array")
        return !expectedAnswer.some(
          (val) =>
            val.rowId === userAnswer.rowId &&
            val.columnId === userAnswer.columnId
        )
      }

      default: {
        throw new Error("invalid compare type")
      }
    }
  },

  evaluateMatrixMultiChoice(
    compare: TMatrixCompare,
    userAnswer: Array<{ rowId: string; columnId: string }>,
    expectedAnswer: Array<{ rowId: string; columnId: string }>
  ) {
    switch (compare) {
      case "ROW_COLUMN_EQUAL": {
        if (userAnswer.length !== expectedAnswer.length) return false
        return isMatrixArrayContainsSame(expectedAnswer, userAnswer)
      }

      case "ROW_COLUMN_NOT_WITHIN": {
        return !isMatrixSubValueList(expectedAnswer, userAnswer)
      }

      case "ROW_COLUMN_WITHIN": {
        return isMatrixSubValueList(expectedAnswer, userAnswer)
      }
      default: {
        throw new Error("invalid compare type")
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

        case EQuestionType.RATING:
        case EQuestionType.NUMBER_INPUT: {
          if (
            params.compare.questionType !== EQuestionType.NUMBER_INPUT &&
            params.compare.questionType !== EQuestionType.RATING
          ) {
            throw new Error("compare questionType mismatch")
          }
          const compare = params.compare.comparison

          if (
            params.userAnswer.questionType !== EQuestionType.NUMBER_INPUT &&
            params.userAnswer.questionType !== EQuestionType.RATING
          ) {
            throw new Error("userAnswer question type mismatch")
          }
          const answer = params.userAnswer.value
          if (
            !isNumberArray(params.expectedValue) &&
            !isNumber(params.expectedValue)
          ) {
            throw new Number("only number or array of number expected")
          }

          return this.evaluateNumberCompare(
            compare,
            answer,
            params.expectedValue
          )
        }

        case EQuestionType.DATE:
        case EQuestionType.DATE_TIME:
        case EQuestionType.TIME: {
          const compareQuestionType = params.compare.questionType
          if (
            compareQuestionType !== EQuestionType.DATE &&
            compareQuestionType !== EQuestionType.DATE_TIME &&
            compareQuestionType !== EQuestionType.TIME
          ) {
            throw new Error("compare question type mismatch")
          }

          const answerType = params.userAnswer.questionType

          if (
            answerType !== EQuestionType.DATE &&
            answerType !== EQuestionType.DATE_TIME &&
            answerType !== EQuestionType.TIME
          ) {
            throw new Error("invalid user answer type")
          }

          if (!isString(params.expectedValue)) {
            throw new Error("expected value must be string or number")
          }

          if (!dayjs(params.expectedValue).isValid()) {
            throw new Error("expected value not a valid date")
          }

          return this.evaluateDateCompare(
            params.compare.comparison,
            params.userAnswer.value,
            params.expectedValue
          )
        }
        case EQuestionType.MATRIX_SINGLE_CHOICE:
        case EQuestionType.MATRIX_MULTI_CHOICE: {
          if (
            params.compare.questionType !==
              EQuestionType.MATRIX_SINGLE_CHOICE &&
            params.compare.questionType !== EQuestionType.MATRIX_MULTI_CHOICE
          ) {
            throw new Error("invalida compare type")
          }
        }
      }
    }
  },
}

export default engine
