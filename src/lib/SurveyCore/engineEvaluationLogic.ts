import dayjs from "dayjs"
import {
  containsAll,
  containsSameElement,
  isNumber,
  isNumberArray,
  isString,
  isStringArray,
} from "../utils"
import {
  evaluateConditionErrors,
  handleEvaluateMatrixSingleChoiceError,
  handleEvaluateNumberCompareError,
  handleEvaluateTextCompareError,
  handleEvaluteChoiceCompareError,
  SurveyEngineError,
} from "./surveyError"
import {
  EQuestionType,
  type TAnswer,
  type TChoiceCompare,
  type TDateTimeCompare,
  type TFileCompare,
  type TLogicCompares,
  type TLogicExpectedValue,
  type TMatrixCompare,
  type TNumberCompare,
  type TTextInputCompare,
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

export type TEvaluteConditionPayload =
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

export function evaluateCondition(params: TEvaluteConditionPayload) {
  if (params.type === "QUESTION") {
    switch (params.questionType) {
      case EQuestionType.TEXT_INPUT: {
        if (params.compare.questionType !== EQuestionType.TEXT_INPUT) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.TEXT_INPUT,
            params.compare.questionType,
          )
        }

        if (params.userAnswer.questionType !== EQuestionType.TEXT_INPUT) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.TEXT_INPUT,
            params.userAnswer.questionType,
          )
        }
        const answer = params.userAnswer.value
        if (
          !isStringArray(params.expectedValue) &&
          !isString(params.expectedValue)
        ) {
          throw new SurveyEngineError(
            `[evaluateCondition -> TEXT_INPUT] invalid expected value type`,
            {
              expected: "string | Array<string>",
              received: typeof params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateTextCompare(
          params.compare.comparison,
          answer,
          params.expectedValue,
        )
      }

      case EQuestionType.RATING:
      case EQuestionType.NUMBER_INPUT: {
        if (
          params.compare.questionType !== EQuestionType.NUMBER_INPUT &&
          params.compare.questionType !== EQuestionType.RATING
        ) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.NUMBER_INPUT,
            params.compare.questionType,
          )
        }
        const compare = params.compare.comparison
        if (
          params.userAnswer.questionType !== EQuestionType.NUMBER_INPUT &&
          params.userAnswer.questionType !== EQuestionType.RATING
        ) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.NUMBER_INPUT,
            params.userAnswer.questionType,
          )
        }
        const answer = params.userAnswer.value
        if (
          !isNumberArray(params.expectedValue) &&
          !isNumber(params.expectedValue)
        ) {
          throw new SurveyEngineError(
            `[evaluateCondition -> NUMBER_INPUT] invalid expected value type`,
            {
              expected: "number | Array<number>",
              received: typeof params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateNumberCompare(compare, answer, params.expectedValue)
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
          evaluateConditionErrors.compareMismatch(
            EQuestionType.DATE,
            compareQuestionType,
          )
        }
        const answerType = params.userAnswer.questionType
        if (
          answerType !== EQuestionType.DATE &&
          answerType !== EQuestionType.DATE_TIME &&
          answerType !== EQuestionType.TIME
        ) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.DATE,
            answerType,
          )
        }
        if (!isString(params.expectedValue)) {
          throw new SurveyEngineError(
            `[evaluateCondition -> DATE] invalid expected value type`,
            {
              expected: "string",
              received: typeof params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        if (!dayjs(params.expectedValue).isValid()) {
          throw new SurveyEngineError(
            `[evaluateCondition -> DATE] expected value is not a valid date`,
            {
              expected: "valid date string",
              received: params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateDateCompare(
          params.compare.comparison,
          params.userAnswer.value,
          params.expectedValue,
        )
      }

      case EQuestionType.SINGLE_CHOICE: {
        if (params.compare.questionType !== EQuestionType.SINGLE_CHOICE) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.SINGLE_CHOICE,
            params.compare.questionType,
          )
        }
        if (params.userAnswer.questionType !== EQuestionType.SINGLE_CHOICE) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.SINGLE_CHOICE,
            params.userAnswer.questionType,
          )
        }
        if (
          !isString(params.expectedValue) &&
          !isStringArray(params.expectedValue)
        ) {
          throw new SurveyEngineError(
            `[evaluateCondition -> SINGLE_CHOICE] invalid expected value type`,
            {
              expected: "string | Array<string>",
              received: typeof params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateSingleChoiceCompare(
          params.compare.comparison,
          params.userAnswer.value,
          params.expectedValue,
        )
      }

      case EQuestionType.MULTIPLE_CHOICE: {
        if (params.compare.questionType !== EQuestionType.MULTIPLE_CHOICE) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.MULTIPLE_CHOICE,
            params.compare.questionType,
          )
        }
        if (params.userAnswer.questionType !== EQuestionType.MULTIPLE_CHOICE) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.MULTIPLE_CHOICE,
            params.userAnswer.questionType,
          )
        }
        if (!isStringArray(params.expectedValue)) {
          throw new SurveyEngineError(
            `[evaluateCondition -> MULTIPLE_CHOICE] invalid expected value type`,
            {
              expected: "Array<string>",
              received: typeof params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateMultiChoiceCompare(
          params.compare.comparison,
          params.userAnswer.value,
          params.expectedValue,
        )
      }

      case EQuestionType.MATRIX_SINGLE_CHOICE: {
        if (
          params.compare.questionType !== EQuestionType.MATRIX_SINGLE_CHOICE
        ) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.MATRIX_SINGLE_CHOICE,
            params.compare.questionType,
          )
        }
        if (
          params.userAnswer.questionType !== EQuestionType.MATRIX_SINGLE_CHOICE
        ) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.MATRIX_SINGLE_CHOICE,
            params.userAnswer.questionType,
          )
        }
        const expectedValue = params.expectedValue
        const isObj =
          !Array.isArray(expectedValue) &&
          typeof expectedValue === "object" &&
          expectedValue !== null &&
          "rowId" in expectedValue &&
          "columnId" in expectedValue
        const isArr = isMatrixValueArray(expectedValue)
        if (!isObj && !isArr) {
          throw new SurveyEngineError(
            `[evaluateCondition -> MATRIX_SINGLE_CHOICE] invalid expected value type`,
            {
              expected:
                "{ rowId: string; columnId: string } | Array<{ rowId: string; columnId: string }>",
              received: typeof expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateMatrixSingleChoice(
          params.compare.comparison,
          params.userAnswer.value,
          expectedValue,
        )
      }

      case EQuestionType.MATRIX_MULTI_CHOICE: {
        if (params.compare.questionType !== EQuestionType.MATRIX_MULTI_CHOICE) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.MATRIX_MULTI_CHOICE,
            params.compare.questionType,
          )
        }
        if (
          params.userAnswer.questionType !== EQuestionType.MATRIX_MULTI_CHOICE
        ) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.MATRIX_MULTI_CHOICE,
            params.userAnswer.questionType,
          )
        }
        if (!isMatrixValueArray(params.expectedValue)) {
          throw new SurveyEngineError(
            `[evaluateCondition -> MATRIX_MULTI_CHOICE] invalid expected value type`,
            {
              expected: "Array<{ rowId: string; columnId: string }>",
              received: typeof params.expectedValue,
              method: "evaluateCondition",
            },
          )
        }
        return evaluateMatrixMultiChoice(
          params.compare.comparison,
          params.userAnswer.value,
          params.expectedValue,
        )
      }

      case EQuestionType.FILE_UPLOAD: {
        if (params.compare.questionType !== EQuestionType.FILE_UPLOAD) {
          evaluateConditionErrors.compareMismatch(
            EQuestionType.FILE_UPLOAD,
            params.compare.questionType,
          )
        }
        if (params.userAnswer.questionType !== EQuestionType.FILE_UPLOAD) {
          evaluateConditionErrors.userAnswerMismatch(
            EQuestionType.FILE_UPLOAD,
            params.userAnswer.questionType,
          )
        }
        return evaluateFileCompare(
          params.compare.comparison,
          params.userAnswer.value,
        )
      }

      default: {
        throw new SurveyEngineError(
          `[evaluateCondition] unhandled question type`,
          {
            expected: "valid EQuestionType",
            received: params.questionType,
            method: "evaluateCondition",
          },
        )
      }
    }
  } else if (params.type === "VARIABLE" && params.dataType === "string") {
    return evaluateTextCompare(
      params.compare,
      params.value,
      params.expectedValue,
    )
  } else if (params.type === "VARIABLE" && params.dataType === "number") {
    return evaluateNumberCompare(
      params.compare,
      params.value,
      params.expectedValue,
    )
  } else {
    throw new SurveyEngineError(
      `[evaluateCondition] unhandled condition type`,
      {
        expected: "QUESTION | VARIABLE",
        received: params,
        method: "evaluateCondition",
      },
    )
  }
}
