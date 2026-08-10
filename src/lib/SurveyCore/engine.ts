import dayjs from "dayjs"
import { isNumber, isNumberArray, isString, isStringArray } from "../utils"
import {
  evaluateDateCompare,
  evaluateFileCompare,
  evaluateMatrixMultiChoice,
  evaluateMatrixSingleChoice,
  evaluateMultiChoiceCompare,
  evaluateNumberCompare,
  evaluateSingleChoiceCompare,
  evaluateTextCompare,
} from "./engineEvaluationLogic"
import { evaluateConditionErrors, SurveyEngineError } from "./surveyError"
import type {
  TAnswer,
  TLogicCompares,
  TLogicExpectedValue,
  TNumberCompare,
  TTextInputCompare,
} from "./surveyInterface"
import { EQuestionType } from "./surveyInterface"
import { isMatrixValueArray } from "./surveyUtils"

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
  evaluateCondition(params: TEvaluteConditionPayload) {
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
          if (
            params.userAnswer.questionType !== EQuestionType.MULTIPLE_CHOICE
          ) {
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
            params.userAnswer.questionType !==
            EQuestionType.MATRIX_SINGLE_CHOICE
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
          if (
            params.compare.questionType !== EQuestionType.MATRIX_MULTI_CHOICE
          ) {
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
  },
}

export default engine
