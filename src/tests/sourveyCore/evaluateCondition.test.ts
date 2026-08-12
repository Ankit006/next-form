import { describe, expect, it } from "vitest"
import { evaluateCondition } from "@/lib/SurveyCore/engineEvaluationLogic"
import { SurveyEngineError } from "@/lib/SurveyCore/surveyError"
import {
  EQuestionType,
  type TAnswer,
  type TLogicCompares,
  type TLogicExpectedValue,
} from "@/lib/SurveyCore/surveyInterface"

describe("evaluateCondition -> TEXT_INPUT", () => {
  const userAnswer: TAnswer = {
    questionType: EQuestionType.TEXT_INPUT,
    value: "Hello World!",
  }

  it("EQUAL - matches exact string", () => {
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

  it("EQUAL - fails for non-matching string", () => {
    const expectedValue: TLogicExpectedValue = "dream"
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

    expect(result).toBe(false)
  })

  it("CONTAINS - returns true when substring is present", () => {
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

  it("STARTS_WITH - returns true when text starts with prefix", () => {
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

  it("ENDS_WITH - returns true when text ends with suffix", () => {
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

  it("REGEX_MATCH - returns true for regex match", () => {
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

  it("WITHIN - returns true when text is in array", () => {
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

  it("throws SurveyEngineError on compare questionType mismatch", () => {
    const expectedValue: TLogicExpectedValue = "Hello World!"
    const compare: TLogicCompares = {
      questionType: EQuestionType.DATE_TIME,
      comparison: "AFTER",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        userAnswer,
        expectedValue,
        compare,
        questionType: EQuestionType.TEXT_INPUT,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on userAnswer questionType mismatch", () => {
    const wrongAnswer: TAnswer = {
      questionType: EQuestionType.NUMBER_INPUT,
      value: 42,
    }
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.TEXT_INPUT,
        userAnswer: wrongAnswer,
        expectedValue: "test",
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on invalid expectedValue type", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.TEXT_INPUT,
        userAnswer,
        expectedValue: 123 as unknown as TLogicExpectedValue,
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })
})

describe("evaluateCondition -> NUMBER_INPUT & RATING", () => {
  const numAnswer: TAnswer = {
    questionType: EQuestionType.NUMBER_INPUT,
    value: 42,
  }

  const ratingAnswer: TAnswer = {
    questionType: EQuestionType.RATING,
    value: 4,
  }

  it("EQUAL - number equality", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 42,
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 10,
        compare,
      }),
    ).toBe(false)
  })

  it("GREATER & GREATER_THAN_EQUAL", () => {
    const greaterCompare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "GREATER",
    }
    const gteCompare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "GREATER_THAN_EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 40,
        compare: greaterCompare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 42,
        compare: greaterCompare,
      }),
    ).toBe(false)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 42,
        compare: gteCompare,
      }),
    ).toBe(true)
  })

  it("LESSER & LESSER_THAN_EQUAL", () => {
    const lesserCompare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "LESSER",
    }
    const lteCompare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "LESSER_THAN_EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 50,
        compare: lesserCompare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 42,
        compare: lteCompare,
      }),
    ).toBe(true)
  })

  it("WITHIN - number array inclusion", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "WITHIN",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: [10, 20, 42],
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: [10, 20, 30],
        compare,
      }),
    ).toBe(false)
  })

  it("RATING - evaluates identically to NUMBER_INPUT", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.RATING,
      comparison: "GREATER_THAN_EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.RATING,
        userAnswer: ratingAnswer,
        expectedValue: 4,
        compare,
      }),
    ).toBe(true)
  })

  it("throws SurveyEngineError on invalid expectedValue type", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: "42" as unknown as TLogicExpectedValue,
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on compare type mismatch", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: numAnswer,
        expectedValue: 42,
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on userAnswer type mismatch", () => {
    const wrongAnswer: TAnswer = {
      questionType: EQuestionType.TEXT_INPUT,
      value: "42",
    }
    const compare: TLogicCompares = {
      questionType: EQuestionType.NUMBER_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.NUMBER_INPUT,
        userAnswer: wrongAnswer,
        expectedValue: 42,
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })
})

describe("evaluateCondition -> DATE, DATE_TIME, TIME", () => {
  const dateAnswer: TAnswer = {
    questionType: EQuestionType.DATE,
    value: "2026-08-12",
  }

  it("AFTER & AFTER_OR_EQUALS", () => {
    const afterCompare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "AFTER",
    }
    const afterOrEqualsCompare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "AFTER_OR_EQUALS",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-10",
        compare: afterCompare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-12",
        compare: afterCompare,
      }),
    ).toBe(false)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-12",
        compare: afterOrEqualsCompare,
      }),
    ).toBe(true)
  })

  it("BEFORE & BEFORE_OR_EQUALS", () => {
    const beforeCompare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "BEFORE",
    }
    const beforeOrEqualsCompare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "BEFORE_OR_EQUALS",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-15",
        compare: beforeCompare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-12",
        compare: beforeOrEqualsCompare,
      }),
    ).toBe(true)
  })

  it("EQUALS & NOT_EQUAL", () => {
    const equalsCompare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "EQUALS",
    }
    const notEqualsCompare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "NOT_EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-12",
        compare: equalsCompare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-15",
        compare: notEqualsCompare,
      }),
    ).toBe(true)
  })

  it("throws SurveyEngineError on non-string expectedValue", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "EQUALS",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: 12345 as unknown as TLogicExpectedValue,
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on invalid date string format", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "EQUALS",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "invalid-date-string-xyz",
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on compare type mismatch", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: dateAnswer,
        expectedValue: "2026-08-12",
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on userAnswer type mismatch", () => {
    const wrongAnswer: TAnswer = {
      questionType: EQuestionType.TEXT_INPUT,
      value: "2026-08-12",
    }
    const compare: TLogicCompares = {
      questionType: EQuestionType.DATE,
      comparison: "EQUALS",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.DATE,
        userAnswer: wrongAnswer,
        expectedValue: "2026-08-12",
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })
})

describe("evaluateCondition -> SINGLE_CHOICE", () => {
  const singleChoiceAnswer: TAnswer = {
    questionType: EQuestionType.SINGLE_CHOICE,
    value: "opt-1",
  }

  it("EQUAL", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.SINGLE_CHOICE,
      comparison: "EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: "opt-1",
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: "opt-2",
        compare,
      }),
    ).toBe(false)
  })

  it("WITHIN", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.SINGLE_CHOICE,
      comparison: "WITHIN",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: ["opt-1", "opt-2", "opt-3"],
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: ["opt-2", "opt-3"],
        compare,
      }),
    ).toBe(false)
  })

  it("NOT_WITHIN", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.SINGLE_CHOICE,
      comparison: "NOT_WITHIN",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: ["opt-2", "opt-3"],
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: ["opt-1", "opt-2"],
        compare,
      }),
    ).toBe(false)
  })

  it("throws SurveyEngineError on invalid expectedValue type", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.SINGLE_CHOICE,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: 123 as unknown as TLogicExpectedValue,
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError when expectedValue is Array for EQUAL comparison", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.SINGLE_CHOICE,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: ["opt-1", "opt-2"],
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })

  it("throws SurveyEngineError on compare type mismatch", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.TEXT_INPUT,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.SINGLE_CHOICE,
        userAnswer: singleChoiceAnswer,
        expectedValue: "opt-1",
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })
})

describe("evaluateCondition -> MULTIPLE_CHOICE", () => {
  const multiChoiceAnswer: TAnswer = {
    questionType: EQuestionType.MULTIPLE_CHOICE,
    value: ["opt-1", "opt-2"],
  }

  it("EQUAL - exact set match regardless of option order", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MULTIPLE_CHOICE,
      comparison: "EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MULTIPLE_CHOICE,
        userAnswer: multiChoiceAnswer,
        expectedValue: ["opt-2", "opt-1"],
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MULTIPLE_CHOICE,
        userAnswer: multiChoiceAnswer,
        expectedValue: ["opt-1"],
        compare,
      }),
    ).toBe(false)
  })

  it("WITHIN - user answers contain all expected options", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MULTIPLE_CHOICE,
      comparison: "WITHIN",
    }

    const multiAnswerWithThree: TAnswer = {
      questionType: EQuestionType.MULTIPLE_CHOICE,
      value: ["opt-1", "opt-2", "opt-3"],
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MULTIPLE_CHOICE,
        userAnswer: multiAnswerWithThree,
        expectedValue: ["opt-1", "opt-2"],
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MULTIPLE_CHOICE,
        userAnswer: multiAnswerWithThree,
        expectedValue: ["opt-1", "opt-4"],
        compare,
      }),
    ).toBe(false)
  })

  it("NOT_WITHIN", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MULTIPLE_CHOICE,
      comparison: "NOT_WITHIN",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MULTIPLE_CHOICE,
        userAnswer: multiChoiceAnswer,
        expectedValue: ["opt-1", "opt-3"],
        compare,
      }),
    ).toBe(true)
  })

  it("throws SurveyEngineError on non-array expectedValue", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MULTIPLE_CHOICE,
      comparison: "EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MULTIPLE_CHOICE,
        userAnswer: multiChoiceAnswer,
        expectedValue: "opt-1",
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })
})

describe("evaluateCondition -> MATRIX_SINGLE_CHOICE", () => {
  const matrixSingleAnswer: TAnswer = {
    questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
    value: { rowId: "r1", columnId: "c1" },
  }

  it("ROW_COLUMN_EQUAL", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
      comparison: "ROW_COLUMN_EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
        userAnswer: matrixSingleAnswer,
        expectedValue: { rowId: "r1", columnId: "c1" },
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
        userAnswer: matrixSingleAnswer,
        expectedValue: { rowId: "r1", columnId: "c2" },
        compare,
      }),
    ).toBe(false)
  })

  it("ROW_COLUMN_WITHIN & ROW_COLUMN_NOT_WITHIN", () => {
    const withinCompare: TLogicCompares = {
      questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
      comparison: "ROW_COLUMN_WITHIN",
    }
    const notWithinCompare: TLogicCompares = {
      questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
      comparison: "ROW_COLUMN_NOT_WITHIN",
    }

    const targetList = [
      { rowId: "r1", columnId: "c1" },
      { rowId: "r2", columnId: "c2" },
    ]

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
        userAnswer: matrixSingleAnswer,
        expectedValue: targetList,
        compare: withinCompare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
        userAnswer: matrixSingleAnswer,
        expectedValue: targetList,
        compare: notWithinCompare,
      }),
    ).toBe(false)
  })

  it("throws SurveyEngineError when expectedValue is array for ROW_COLUMN_EQUAL", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
      comparison: "ROW_COLUMN_EQUAL",
    }

    expect(() =>
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
        userAnswer: matrixSingleAnswer,
        expectedValue: [{ rowId: "r1", columnId: "c1" }],
        compare,
      }),
    ).toThrow(SurveyEngineError)
  })
})

describe("evaluateCondition -> MATRIX_MULTI_CHOICE", () => {
  const matrixMultiAnswer: TAnswer = {
    questionType: EQuestionType.MATRIX_MULTI_CHOICE,
    value: [
      { rowId: "r1", columnId: "c1" },
      { rowId: "r1", columnId: "c2" },
    ],
  }

  it("ROW_COLUMN_EQUAL", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MATRIX_MULTI_CHOICE,
      comparison: "ROW_COLUMN_EQUAL",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_MULTI_CHOICE,
        userAnswer: matrixMultiAnswer,
        expectedValue: [
          { rowId: "r1", columnId: "c2" },
          { rowId: "r1", columnId: "c1" },
        ],
        compare,
      }),
    ).toBe(true)
  })

  it("ROW_COLUMN_WITHIN", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.MATRIX_MULTI_CHOICE,
      comparison: "ROW_COLUMN_WITHIN",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.MATRIX_MULTI_CHOICE,
        userAnswer: matrixMultiAnswer,
        expectedValue: [
          { rowId: "r1", columnId: "c1" },
          { rowId: "r1", columnId: "c2" },
          { rowId: "r2", columnId: "c1" },
        ],
        compare,
      }),
    ).toBe(true)
  })
})

describe("evaluateCondition -> FILE_UPLOAD", () => {
  const emptyFileAnswer: TAnswer = {
    questionType: EQuestionType.FILE_UPLOAD,
    value: [],
  }

  const uploadedFileAnswer: TAnswer = {
    questionType: EQuestionType.FILE_UPLOAD,
    value: ["https://example.com/file.pdf"],
  }

  it("IS_EMPTY", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.FILE_UPLOAD,
      comparison: "IS_EMPTY",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.FILE_UPLOAD,
        userAnswer: emptyFileAnswer,
        expectedValue: [],
        compare,
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.FILE_UPLOAD,
        userAnswer: uploadedFileAnswer,
        expectedValue: [],
        compare,
      }),
    ).toBe(false)
  })

  it("IS_NOT_EMPTY", () => {
    const compare: TLogicCompares = {
      questionType: EQuestionType.FILE_UPLOAD,
      comparison: "IS_NOT_EMPTY",
    }

    expect(
      evaluateCondition({
        type: "QUESTION",
        questionType: EQuestionType.FILE_UPLOAD,
        userAnswer: uploadedFileAnswer,
        expectedValue: [],
        compare,
      }),
    ).toBe(true)
  })
})

describe("evaluateCondition -> VARIABLE", () => {
  it("evaluates string variables", () => {
    expect(
      evaluateCondition({
        type: "VARIABLE",
        dataType: "string",
        value: "John Doe",
        expectedValue: "John Doe",
        compare: "EQUAL",
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "VARIABLE",
        dataType: "string",
        value: "John Doe",
        expectedValue: "John",
        compare: "CONTAINS",
      }),
    ).toBe(true)
  })

  it("evaluates number variables", () => {
    expect(
      evaluateCondition({
        type: "VARIABLE",
        dataType: "number",
        value: 100,
        expectedValue: 50,
        compare: "GREATER",
      }),
    ).toBe(true)

    expect(
      evaluateCondition({
        type: "VARIABLE",
        dataType: "number",
        value: 100,
        expectedValue: 100,
        compare: "EQUAL",
      }),
    ).toBe(true)
  })

  it("throws SurveyEngineError on unhandled condition payload type", () => {
    expect(() =>
      evaluateCondition({
        type: "UNKNOWN" as unknown as "QUESTION",
      } as unknown as Parameters<typeof evaluateCondition>[0]),
    ).toThrow(SurveyEngineError)
  })
})
