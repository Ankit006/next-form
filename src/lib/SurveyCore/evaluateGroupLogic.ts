import {
  evaluateCondition,
  type TEvaluteConditionPayload,
} from "./engineEvaluationLogic"
import { SurveyEngineError } from "./surveyError"
import type {
  ILogicCondition,
  ISurveyVariable,
  TGroupOperator,
  TRunTimeAnswer,
} from "./surveyInterface"

interface IEvaluateSingleGroupLogicProps {
  operator: TGroupOperator
  comparisons: Array<ILogicCondition>
  answers: TRunTimeAnswer
  variables: Array<ISurveyVariable>
}

export function evaluteSingleGroupLogic({
  operator,
  answers,
  comparisons,
  variables,
}: IEvaluateSingleGroupLogicProps) {
  const resultList: boolean[] = []

  for (const compare of comparisons) {
    if (compare.source.source === "QUESTION") {
      const answer = answers[compare.source.questionId]

      const evaluatePayload: TEvaluteConditionPayload = {
        type: "QUESTION",
        questionType: answer.questionType,
        userAnswer: answer,
        expectedValue: compare.expectedValue,
        compare: compare.compares,
      }
      resultList.push(evaluateCondition(evaluatePayload) === true)
    } else {
      const variableId = compare.source.variableId
      const variable = variables.find((variable) => variable.id === variableId)
      if (!variable) {
        throw new SurveyEngineError(
          `[evaluateSingleGroupLogic] expected valid vairable Id in comparison source`,
          {
            expected: "valid variable id",
            received: variableId,
            method: "evaluateSingleChoiceCompare",
          },
        )
      }
      if (!variable.value) {
        throw new SurveyEngineError(
          `[evaluateSingleGroupLogic] comparison variable value must exist`,
          {
            expected: "variable value",
            received: "undefined",
            method: "evaluateSingleChoiceCompare",
          },
        )
      }

      if (compare.compares.questionType !== "VARIABLE") {
        throw new SurveyEngineError(
          `[evaluateSingleGroupLogic] comparsion type must be variable`,
          {
            expected: "variable comparsion",
            received: compare.compares.questionType,
            method: "evaluateSingleChoiceCompare",
          },
        )
      }
      if (
        compare.source.dataType === "string" &&
        compare.compares.dataType === "string"
      ) {
        if (typeof compare.expectedValue !== "string") {
          throw new SurveyEngineError(
            `[evaluateSingleGroupLogic] expectedValue must be string for string type variable`,
            {
              expected: "string",
              received: typeof compare.expectedValue,
              method: "evaluateSingleChoiceCompare",
            },
          )
        }

        const paylaod: TEvaluteConditionPayload = {
          type: "VARIABLE",
          dataType: "string",
          compare: compare.compares.comparison,
          expectedValue: compare.expectedValue,
          value: variable.value as string,
        }

        resultList.push(evaluateCondition(paylaod) === true)
      }

      if (
        compare.source.dataType === "number" &&
        compare.compares.dataType === "number"
      ) {
        if (typeof compare.expectedValue !== "number") {
          throw new SurveyEngineError(
            `[evaluateSingleGroupLogic] expectedValue must be number for number type variable`,
            {
              expected: "number",
              received: typeof compare.expectedValue,
              method: "evaluateSingleChoiceCompare",
            },
          )
        }

        const paylaod: TEvaluteConditionPayload = {
          type: "VARIABLE",
          dataType: "number",
          compare: compare.compares.comparison,
          expectedValue: compare.expectedValue,
          value: variable.value as number,
        }

        resultList.push(evaluateCondition(paylaod) === true)
      }

      throw new SurveyEngineError(
        `[evaluateSingleGroupLogic] must be valid variable data type₹`,
        {
          expected: "number or string",
          received: compare.source.dataType,
          method: "evaluateSingleChoiceCompare",
        },
      )
    }
  }

  if (operator === "AND") {
    return resultList.every((bol) => bol === true)
  }
  return resultList.some((bol) => bol === true)
}
