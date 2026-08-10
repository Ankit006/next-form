import dayjs from "dayjs"
import {
  containsAll,
  containsSameElement,
  isNumber,
  isNumberArray,
  isStringArray,
} from "../utils"
import {
  handleEvaluateMatrixSingleChoiceError,
  handleEvaluateNumberCompareError,
  handleEvaluateTextCompareError,
  handleEvaluteChoiceCompareError,
  SurveyEngineError,
} from "./surveyError"
import type {
  TChoiceCompare,
  TDateTimeCompare,
  TFileCompare,
  TMatrixCompare,
  TNumberCompare,
  TTextInputCompare,
} from "./surveyInterface"
import {
  isMatrixArrayContainsSame,
  isMatrixSubValueList,
  isMatrixValueArray,
} from "./surveyUtils"

export function evaluateTextCompare(
  compare: TTextInputCompare,
  answer: string,
  expected: string | Array<string>,
) {
  switch (compare) {
    case "EQUAL": {
      if (typeof expected !== "string") {
        handleEvaluateTextCompareError(compare, expected)
      }
      return answer === expected
    }
    case "CONTAINS": {
      if (typeof expected !== "string")
        handleEvaluateTextCompareError(compare, expected)
      return answer.includes(expected)
    }
    case "REGEX_MATCH": {
      if (typeof expected !== "string")
        handleEvaluateTextCompareError(compare, expected)
      const regExp = new RegExp(expected)
      return regExp.test(answer)
    }
    case "STARTS_WITH": {
      if (typeof expected !== "string")
        handleEvaluateTextCompareError(compare, expected)
      return answer.startsWith(expected)
    }
    case "ENDS_WITH": {
      if (typeof expected !== "string")
        handleEvaluateTextCompareError(compare, expected)
      return answer.endsWith(expected)
    }
    case "WITHIN": {
      if (!isStringArray(expected))
        handleEvaluateTextCompareError(compare, expected)
      return expected.includes(answer)
    }
    default: {
      throw new SurveyEngineError(
        `[evaluateTextCompare] unexpected compare provided`,
        {
          expected: "TTextInputCompare",
          received: compare,
          method: "evaluateTextCompare",
        },
      )
    }
  }
}

export function evaluateMultiChoiceCompare(
  compare: TChoiceCompare,
  answer: Array<string>,
  expected: Array<string>,
) {
  switch (compare) {
    case "EQUAL": {
      return containsSameElement<string>(answer, expected)
    }

    case "WITHIN": {
      return containsAll<string>(answer, expected)
    }

    case "NOT_WITHIN": {
      return !containsAll<string>(answer, expected)
    }
    default: {
      throw new SurveyEngineError(
        `[evaluateMultiChoiceCompare] unexpected compare provided`,
        {
          expected: "TChoiceCompare",
          received: compare,
          method: "evaluateMultiChoiceCompare",
        },
      )
    }
  }
}

export function evaluateSingleChoiceCompare(
  compare: TChoiceCompare,
  answer: string,
  expected: string | Array<string>,
) {
  switch (compare) {
    case "EQUAL": {
      if (isStringArray(expected)) {
        handleEvaluteChoiceCompareError(compare)
      }
      return answer === expected
    }
    case "NOT_WITHIN": {
      if (!isStringArray(expected)) {
        handleEvaluteChoiceCompareError(compare)
      }

      return !expected.includes(answer)
    }

    case "WITHIN": {
      if (!isStringArray(expected)) {
        handleEvaluteChoiceCompareError(compare)
      }

      return expected.includes(answer)
    }

    default: {
      throw new SurveyEngineError(
        `[evaluateSingleChoiceCompare] unexpected compare provided`,
        {
          expected: "TChoiceCompare",
          received: compare,
          method: "evaluateSingleChoiceCompare",
        },
      )
    }
  }
}

export function evaluateNumberCompare(
  compare: TNumberCompare,
  answer: number,
  expected: number | Array<number>,
) {
  switch (compare) {
    case "EQUAL": {
      if (!isNumber(expected)) handleEvaluateNumberCompareError(compare)
      return answer === expected
    }

    case "GREATER": {
      if (!isNumber(expected)) handleEvaluateNumberCompareError(compare)

      return answer > expected
    }

    case "GREATER_THAN_EQUAL": {
      if (!isNumber(expected)) handleEvaluateNumberCompareError(compare)
      return answer >= expected
    }
    case "LESSER": {
      if (!isNumber(expected)) handleEvaluateNumberCompareError(compare)
      return answer < expected
    }

    case "LESSER_THAN_EQUAL": {
      if (!isNumber(expected)) handleEvaluateNumberCompareError(compare)
      return answer <= expected
    }

    case "WITHIN": {
      if (!isNumberArray(expected)) handleEvaluateNumberCompareError(compare)
      return expected.includes(answer)
    }

    default: {
      throw new SurveyEngineError(
        `[evaluateNumberCompare] unexpected compare provided`,
        {
          expected: "TNumberCompare",
          received: compare,
          method: "evaluateNumberCompare",
        },
      )
    }
  }
}

export function evaluateDateCompare(
  compare: TDateTimeCompare,
  answer: string,
  expected: string,
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
      throw new SurveyEngineError(
        `[evaluateDateCompare] unexpected compare provided`,
        {
          expected: "TDateTimeCompare",
          received: compare,
          method: "evaluateDateCompare",
        },
      )
    }
  }
}

export function evaluateFileCompare(
  compare: TFileCompare,
  answer: Array<File | string>,
) {
  switch (compare) {
    case "IS_EMPTY": {
      return answer.length === 0
    }
    case "IS_NOT_EMPTY": {
      return answer.length !== 0
    }
    default: {
      throw new SurveyEngineError(
        `[evaluateFileCompare] unexpected compare provided`,
        {
          expected: "TFileCompare",
          received: compare,
          method: "evaluateFileCompare",
        },
      )
    }
  }
}

export function evaluateMatrixSingleChoice(
  compare: TMatrixCompare,
  userAnswer: { rowId: string; columnId: string },
  expectedAnswer:
    | { rowId: string; columnId: string }
    | Array<{ rowId: string; columnId: string }>,
) {
  switch (compare) {
    case "ROW_COLUMN_EQUAL": {
      if (isMatrixValueArray(expectedAnswer))
        handleEvaluateMatrixSingleChoiceError(compare)

      return (
        userAnswer.rowId === expectedAnswer.rowId &&
        userAnswer.columnId === expectedAnswer.columnId
      )
    }
    case "ROW_COLUMN_WITHIN": {
      if (!isMatrixValueArray(expectedAnswer))
        handleEvaluateMatrixSingleChoiceError(compare)
      return expectedAnswer.some(
        (val) =>
          val.rowId === userAnswer.rowId &&
          val.columnId === userAnswer.columnId,
      )
    }
    case "ROW_COLUMN_NOT_WITHIN": {
      if (!isMatrixValueArray(expectedAnswer))
        handleEvaluateMatrixSingleChoiceError(compare)
      return !expectedAnswer.some(
        (val) =>
          val.rowId === userAnswer.rowId &&
          val.columnId === userAnswer.columnId,
      )
    }

    default: {
      throw new SurveyEngineError(
        `[evaluateMatrixSingleChoice] unexpected compare provided`,
        {
          expected: "TMatrixCompare",
          received: compare,
          method: "evaluateMatrixSingleChoice",
        },
      )
    }
  }
}

export function evaluateMatrixMultiChoice(
  compare: TMatrixCompare,
  userAnswer: Array<{ rowId: string; columnId: string }>,
  expectedAnswer: Array<{ rowId: string; columnId: string }>,
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
      throw new SurveyEngineError(
        `[evaluateMatrixMultiChoice] unexpected compare provided`,
        {
          expected: "TMatrixCompare",
          received: compare,
          method: "evaluateMatrixMultiChoice",
        },
      )
    }
  }
}
