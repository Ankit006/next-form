import type {
  EQuestionType,
  TChoiceCompare,
  TMatrixCompare,
  TNumberCompare,
  TTextInputCompare,
} from "./surveyInterface"

export class SurveyEngineError extends Error {
  constructor(
    message: string,
    public readonly context: {
      method: string
      expected: string
      received: string
    },
  ) {
    super(message)
    this.name = "SurveyEngineError"
  }
}

export function handleEvaluateTextCompareError(
  compare: TTextInputCompare,
  expected: string | Array<string>,
): never {
  if (compare !== "WITHIN") {
    throw new SurveyEngineError(
      `[evaluateTextCompare] expected string for compare ${compare}`,
      {
        expected: "string",
        received: typeof expected,
        method: "evaluateTextCompare",
      },
    )
  } else {
    throw new SurveyEngineError(
      `[evaluateTextCompare] expected string array for WITHIN compare`,
      {
        expected: "Array<string>",
        received: typeof expected,
        method: "evaluateTextCompare",
      },
    )
  }
}

export function handleEvaluteChoiceCompareError(
  compare: TChoiceCompare,
): never {
  if (compare === "EQUAL") {
    throw new SurveyEngineError(
      `[evaluateSingleChoiceCompare] expected string for compare ${compare}`,
      {
        expected: "string",
        received: "Array<string>",
        method: "evaluateSingleChoiceCompare",
      },
    )
  } else {
    throw new SurveyEngineError(
      `[evaluateSingleChoiceCompare] expected Array<string> for compare ${compare}`,
      {
        expected: "Array<string>",
        received: "string",
        method: "evaluateSingleChoiceCompare",
      },
    )
  }
}

export function handleEvaluateNumberCompareError(
  compare: TNumberCompare,
): never {
  if (compare === "WITHIN") {
    throw new SurveyEngineError(
      `[evaluateNumberCompare] expected Array<number> for compare ${compare}`,
      {
        expected: "Array<number>",
        received: "number",
        method: "evaluateNumberCompare",
      },
    )
  } else {
    throw new SurveyEngineError(
      `[evaluateNumberCompare] expected number for compare ${compare}`,
      {
        expected: "number",
        received: "Array<number>",
        method: "evaluateNumberCompare",
      },
    )
  }
}

export function handleEvaluateMatrixSingleChoiceError(
  compare: TMatrixCompare,
): never {
  if (compare === "ROW_COLUMN_EQUAL") {
    throw new SurveyEngineError(
      `[evaluateMatrixSingleChoice] expected object for compare ${compare}`,
      {
        expected: "{ rowId: string; columnId: string }",
        received: "Array",
        method: "evaluateMatrixSingleChoice",
      },
    )
  } else {
    throw new SurveyEngineError(
      `[evaluateMatrixSingleChoice] expected array for compare ${compare}`,
      {
        expected: "Array<{ rowId: string; columnId: string }>",
        received: "object",
        method: "evaluateMatrixSingleChoice",
      },
    )
  }
}

export const evaluateConditionErrors: {
  compareMismatch: (
    expectedType: EQuestionType,
    receivedType: EQuestionType | "VARIABLE",
  ) => never
  userAnswerMismatch: (
    expectedType: EQuestionType,
    receivedType: EQuestionType | "VARIABLE",
  ) => never
} = {
  compareMismatch: (
    expectedType: EQuestionType,
    receivedType: EQuestionType | "VARIABLE",
  ): never => {
    throw new SurveyEngineError(
      `[evaluateCondition -> ${expectedType}] compare question type mismatch`,
      {
        expected: expectedType,
        received: receivedType,
        method: "evaluateCondition",
      },
    )
  },

  userAnswerMismatch: (
    expectedType: EQuestionType,
    receivedType: EQuestionType | "VARIABLE",
  ): never => {
    throw new SurveyEngineError(
      `[evaluateCondition -> ${expectedType}] userAnswer type mismatch`,
      {
        expected: expectedType,
        received: receivedType,
        method: "evaluateCondition",
      },
    )
  },
}
