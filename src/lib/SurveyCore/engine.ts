import { EQuestionType } from "./surveyInterface"
import type {
  TAnswer,
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
      expeactedValue: string
      compare: TTextInputCompare
    }
  | {
      type: "VARIABLE"
      dataType: "number"
      value: number
      expeactedValue: number
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
        if (!Array.isArray(expected))
          throw new Error("expect array, get string")
        return expected.includes(answer)
      }
    }
  },
  evaluateCondition(params: TEvaluteConditionPayload) {
    if (params.type === "QUESTION") {
      switch (params.questionType) {
        case EQuestionType.TEXT_INPUT: {
        }
      }
    }
  },
}

export default engine
