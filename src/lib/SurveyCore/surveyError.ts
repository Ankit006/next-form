import type { TChoiceCompare, TTextInputCompare } from "./surveyInterface"

export class SurveyEngineError extends Error {
  constructor(
    message: string,
    public readonly contenxt: {
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
      `[evaluatesingleChoiceCompare] expected string for compare ${compare}`,
      {
        expected: "string",
        received: "Array<string>",
        method: "evaluatesingleChoiceCompare",
      },
    )
  } else {
    throw new SurveyEngineError(
      `[evaluatesingleChoiceCompare] expected Array<string> for compare ${compare}`,
      {
        expected: "Array<string>",
        received: "string",
        method: "evaluatesingleChoiceCompare",
      },
    )
  }
}
