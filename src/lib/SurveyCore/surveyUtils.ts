import { EQuestionType } from "./surveyInterface"
import type {
  IPage,
  IQuestion,
  TChoiceCompare,
  TDateTimeCompare,
  TFileCompare,
  TLogicCompares,
  TNumberCompare,
  TQuestionConfig,
  TTextInputCompare,
} from "./surveyInterface"

export const textCompare: Array<TTextInputCompare> = [
  "CONTAINS",
  "ENDS_WITH",
  "EQUAL",
  "REGEX_MATCH",
  "STARTS_WITH",
  "WITHIN",
] as const
export const numberCompare: Array<TNumberCompare> = [
  "EQUAL",
  "GREATER",
  "GREATER_THAN_EQUAL",
  "LESSER",
  "LESSER_THAN_EQUAL",
  "WITHIN",
] as const
export const dateCompare: Array<TDateTimeCompare> = [
  "AFTER",
  "AFTER_OR_EQUALS",
  "BEFORE",
  "BEFORE_OR_EQUALS",
  "EQUALS",
  "NOT_EQUAL",
] as const
export const choiceCompare: Array<TChoiceCompare> = [
  "EQUAL",
  "NOT_WITHIN",
  "WITHIN",
] as const

export const fileCompare: Array<TFileCompare> = [
  "IS_EMPTY",
  "IS_NOT_EMPTY",
] as const

export function createQuestionDefaultConfig(
  questionType: EQuestionType
): TQuestionConfig {
  switch (questionType) {
    case EQuestionType.DATE:
      return {
        type: EQuestionType.DATE,
        rangeDate: false,
        required: false,
        hidden: false,
        disabled: false,
      }
    case EQuestionType.TIME:
      return {
        type: EQuestionType.TIME,
        required: false,
        hidden: false,
        hour24: false,
        disabled: false,
      }
    case EQuestionType.DATE_TIME:
      return {
        type: EQuestionType.DATE_TIME,
        rangeDate: false,
        hour24: false,
        required: false,
        hidden: false,
        disabled: false,
      }
    case EQuestionType.NUMBER_INPUT:
      return {
        type: EQuestionType.NUMBER_INPUT,
        required: false,
        hidden: false,
        disabled: false,
      }
    case EQuestionType.FILE_UPLOAD:
      return {
        type: EQuestionType.FILE_UPLOAD,
        required: false,
        multiUpload: false,
        disabled: false,
      }
    case EQuestionType.MATRIX_SINGLE_CHOICE:
      return {
        type: EQuestionType.MATRIX_SINGLE_CHOICE,
        required: false,
        hidden: false,
        shuffleColumn: {
          enable: false,
        },
        shuffleRow: {
          enable: false,
        },
        disabled: false,
      }

    case EQuestionType.MATRIX_MULTI_CHOICE:
      return {
        type: EQuestionType.MATRIX_MULTI_CHOICE,
        required: false,
        hidden: false,
        shuffleRow: { enable: false },
        shuffleColumn: { enable: false },
        disabled: false,
      }
    case EQuestionType.RATING:
      return {
        type: EQuestionType.RATING,
        required: false,
        hidden: false,
        count: 5,
        disabled: false,
      }
    case EQuestionType.SINGLE_CHOICE:
      return {
        type: EQuestionType.SINGLE_CHOICE,
        required: false,
        hidden: false,
        shuffle: { enable: false },
        disabled: false,
      }
    case EQuestionType.MULTIPLE_CHOICE:
      return {
        type: EQuestionType.MULTIPLE_CHOICE,
        required: false,
        hidden: false,
        shuffle: { enable: false },
        disabled: false,
      }
    case EQuestionType.TEXT_INPUT:
      return {
        type: EQuestionType.TEXT_INPUT,
        required: false,
        hidden: false,
        multiline: false,
        disabled: false,
      }
    default:
      throw new Error("wrong question type")
  }
}

export function getQuestion({
  pages,
  questionId,
  pageId,
  sectionId,
}: {
  pages: Record<string, IPage>
  questionId: string
  pageId?: string
  sectionId?: string
}): { pageId: string; sectionId: string; question: IQuestion } {
  if (pageId && sectionId) {
    const page = pages[pageId]
    const section = page.sections[sectionId]
    return {
      pageId,
      sectionId,
      question: section.questions[questionId],
    }
  } else if (pageId && !sectionId) {
    const page = pages[pageId]
    const sectionKeys = Object.keys(page.sections)
    for (const key of sectionKeys) {
      const section = page.sections[key]
      const questionObj = section.questions
      if (questionId in questionObj) {
        return {
          pageId,
          sectionId: key,
          question: questionObj[questionId],
        }
      }
    }
    throw new Error("Unable to get question")
  } else if (sectionId && !pageId) {
    const pageKeys = Object.keys(pages)
    for (const key of pageKeys) {
      const page = pages[key]
      if (sectionId in page.sections) {
        const section = page.sections[sectionId]
        return {
          pageId: key,
          sectionId,
          question: section.questions[questionId],
        }
      }
    }
    throw new Error("Unable to find question")
  } else {
    const pageKeys = Object.keys(pages)
    for (const pageKey of pageKeys) {
      const sections = pages[pageKey].sections
      const sectionKeys = Object.keys(sections)
      for (const sectionKey of sectionKeys) {
        const section = sections[sectionKey]
        if (questionId in section.questions) {
          return {
            pageId: pageKey,
            sectionId: sectionKey,
            question: section.questions[questionId],
          }
        }
      }
    }
    throw new Error("Unable to find question")
  }
}

type TLogicalCompareListMap = {
  [EQuestionType.TEXT_INPUT]: Array<TTextInputCompare>
  [EQuestionType.NUMBER_INPUT]: Array<TNumberCompare>
  [EQuestionType.RATING]: Array<TNumberCompare>
  [EQuestionType.DATE]: Array<TDateTimeCompare>
  [EQuestionType.DATE_TIME]: Array<TDateTimeCompare>
  [EQuestionType.TIME]: Array<TDateTimeCompare>
  [EQuestionType.SINGLE_CHOICE]: Array<TChoiceCompare>
  [EQuestionType.MULTIPLE_CHOICE]: Array<TChoiceCompare>
  [EQuestionType.MATRIX_MULTI_CHOICE]: Array<TChoiceCompare>
  [EQuestionType.MATRIX_SINGLE_CHOICE]: Array<TChoiceCompare>
  [EQuestionType.FILE_UPLOAD]: Array<TFileCompare>
}

export function getLogicalCompareListForQuestion<
  T extends keyof TLogicalCompareListMap,
>(type: T): TLogicalCompareListMap[T] {
  switch (type) {
    case EQuestionType.TEXT_INPUT:
      return textCompare as TLogicalCompareListMap[T]
    case EQuestionType.NUMBER_INPUT:
      return numberCompare as TLogicalCompareListMap[T]
    case EQuestionType.RATING:
      return numberCompare as TLogicalCompareListMap[T]
    case EQuestionType.DATE:
      return dateCompare as TLogicalCompareListMap[T]
    case EQuestionType.DATE_TIME:
      return dateCompare as TLogicalCompareListMap[T]
    case EQuestionType.TIME:
      return dateCompare as TLogicalCompareListMap[T]
    case EQuestionType.SINGLE_CHOICE:
      return choiceCompare as TLogicalCompareListMap[T]
    case EQuestionType.MULTIPLE_CHOICE:
      return choiceCompare as TLogicalCompareListMap[T]
    case EQuestionType.MATRIX_SINGLE_CHOICE:
      return choiceCompare as TLogicalCompareListMap[T]
    case EQuestionType.MATRIX_MULTI_CHOICE:
      return choiceCompare as TLogicalCompareListMap[T]
    case EQuestionType.FILE_UPLOAD:
      return fileCompare as TLogicalCompareListMap[T]
    default:
      throw new Error("Invalid question type provided")
  }
}
type TLogicalComparesForVariablesListMap = {
  ["string"]: Array<TTextInputCompare>
  ["number"]: Array<TNumberCompare>
}

export function getLogicalCompareListForVariable<
  T extends keyof TLogicalComparesForVariablesListMap,
>(dataType: T): TLogicalComparesForVariablesListMap[T] {
  if (dataType === "string") {
    return textCompare as TLogicalComparesForVariablesListMap[T]
  } else if (dataType === "number") {
    return numberCompare as TLogicalComparesForVariablesListMap[T]
  } else {
    throw new Error("Please provide valid data type of a variable")
  }
}

export function getLogicalCompare(
  type: EQuestionType,
  compare:
    | TTextInputCompare
    | TNumberCompare
    | TDateTimeCompare
    | TChoiceCompare
    | TFileCompare
): TLogicCompares {
  switch (type) {
    case EQuestionType.TEXT_INPUT: {
      const compareList = getLogicalCompareListForQuestion(
        EQuestionType.TEXT_INPUT
      )
      if (!compareList.includes(compare as TTextInputCompare)) {
        throw new Error("invalid logical compare provided for text input")
      }
      return {
        questionType: EQuestionType.TEXT_INPUT,
        comparison: compare as TTextInputCompare,
      }
    }

    case EQuestionType.NUMBER_INPUT: {
      const numberCompares = getLogicalCompareListForQuestion(
        EQuestionType.NUMBER_INPUT
      )
      if (!numberCompares.includes(compare as TNumberCompare)) {
        throw new Error(`wrong compare provided for number input`)
      }
      return {
        questionType: EQuestionType.NUMBER_INPUT,
        comparison: compare as TNumberCompare,
      }
    }

    case EQuestionType.RATING: {
      const ratingCompare = getLogicalCompareListForQuestion(
        EQuestionType.RATING
      )
      if (!ratingCompare.includes(compare as TNumberCompare)) {
        throw new Error("wrong compare provided for rating")
      }
      return {
        questionType: EQuestionType.RATING,
        comparison: compare as TNumberCompare,
      }
    }
    case EQuestionType.DATE: {
      const dateCompares = getLogicalCompareListForQuestion(EQuestionType.DATE)
      if (!dateCompares.includes(compare as TDateTimeCompare)) {
        throw new Error("wrong compare provided fro date input")
      }
      return {
        questionType: EQuestionType.DATE,
        comparison: compare as TDateTimeCompare,
      }
    }

    case EQuestionType.DATE_TIME: {
      const dateTimeCompares = getLogicalCompareListForQuestion(
        EQuestionType.DATE_TIME
      )
      if (!dateTimeCompares.includes(compare as TDateTimeCompare)) {
        throw new Error("wrong compare provided for date time input")
      }

      return {
        questionType: EQuestionType.DATE_TIME,
        comparison: compare as TDateTimeCompare,
      }
    }

    case EQuestionType.TIME: {
      const timeCompares = getLogicalCompareListForQuestion(EQuestionType.TIME)
      if (!timeCompares.includes(compare as TDateTimeCompare)) {
        throw new Error("wrong compare provided for time input")
      }

      return {
        questionType: EQuestionType.TIME,
        comparison: compare as TDateTimeCompare,
      }
    }

    case EQuestionType.SINGLE_CHOICE: {
      const choiceCompares = getLogicalCompareListForQuestion(
        EQuestionType.SINGLE_CHOICE
      )
      if (!choiceCompares.includes(compare as TChoiceCompare)) {
        throw new Error("wrong compare provided for single choice input")
      }

      return {
        questionType: EQuestionType.SINGLE_CHOICE,
        comparison: compare as TChoiceCompare,
      }
    }

    case EQuestionType.MULTIPLE_CHOICE: {
      const multiChoiceCompares = getLogicalCompareListForQuestion(
        EQuestionType.MULTIPLE_CHOICE
      )
      if (!multiChoiceCompares.includes(compare as TChoiceCompare)) {
        throw new Error("wrong choice provided for multi choice input")
      }
      return {
        questionType: EQuestionType.MULTIPLE_CHOICE,
        comparison: compare as TChoiceCompare,
      }
    }

    case EQuestionType.MATRIX_SINGLE_CHOICE: {
      const matrixCompares = getLogicalCompareListForQuestion(
        EQuestionType.MATRIX_SINGLE_CHOICE
      )
      if (!matrixCompares.includes(compare as TChoiceCompare)) {
        throw new Error("wrong choice provided for matrix single input")
      }

      return {
        questionType: EQuestionType.MATRIX_SINGLE_CHOICE,
        comparison: compare as TChoiceCompare,
      }
    }

    case EQuestionType.MATRIX_MULTI_CHOICE: {
      const multiMatrixCompares = getLogicalCompareListForQuestion(
        EQuestionType.MATRIX_MULTI_CHOICE
      )
      if (!multiMatrixCompares.includes(compare as TChoiceCompare)) {
        throw new Error("wrong choice provided for matrix multi input")
      }

      return {
        questionType: EQuestionType.MATRIX_MULTI_CHOICE,
        comparison: compare as TChoiceCompare,
      }
    }

    case EQuestionType.FILE_UPLOAD: {
      const fileCompare = getLogicalCompareListForQuestion(
        EQuestionType.FILE_UPLOAD
      )
      if (!fileCompare.includes(compare as TFileCompare)) {
        throw new Error("Wrong compare provided for File uplaod field")
      }

      return {
        questionType: EQuestionType.FILE_UPLOAD,
        comparison: compare as TFileCompare,
      }
    }

    default:
      throw new Error("Provide valid types")
  }
}

export function getLogicalCompareForVariable(
  variableDataType: "string" | "number",
  compare: TTextInputCompare | TNumberCompare
): TLogicCompares {
  if (variableDataType === "string") {
    const compareList = getLogicalCompareListForVariable("string")

    if (!compareList.includes(compare as TTextInputCompare)) {
      throw new Error("wrong compare provided for string variable")
    }

    return {
      dataType: "string",
      comparison: compare as TTextInputCompare,
      questionType: "VARIABLE",
    }
  } else {
    const compareList = getLogicalCompareListForVariable("number")

    if (!compareList.includes(compare as TNumberCompare)) {
      throw new Error("wrong compare provided for number variable")
    }

    return {
      dataType: "number",
      comparison: compare as TNumberCompare,
      questionType: "VARIABLE",
    }
  }
}
