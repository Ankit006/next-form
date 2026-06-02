import { EQuestionType } from "./surveyCore"
import type { TQuestionConfig } from "./surveyCore"

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
      }
    case EQuestionType.FILE_UPLOAD:
      return {
        type: EQuestionType.FILE_UPLOAD,
        required: false,
        multiUpload: false,
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
      }

    case EQuestionType.MATRIX_MULTI_CHOICE:
      return {
        type: EQuestionType.MATRIX_MULTI_CHOICE,
        required: false,
        hidden: false,
        shuffleRow: { enable: false },
        shuffleColumn: { enable: false },
      }
    case EQuestionType.RATING:
      return {
        type: EQuestionType.RATING,
        required: false,
        hidden: false,
        count: 5,
      }
    case EQuestionType.SINGLE_CHOICE:
      return {
        type: EQuestionType.SINGLE_CHOICE,
        required: false,
        hidden: false,
        shuffle: { enable: false },
      }
    case EQuestionType.MULTIPLE_CHOICE:
      return {
        type: EQuestionType.MULTIPLE_CHOICE,
        required: false,
        hidden: false,
        shuffle: { enable: false },
      }
    case EQuestionType.TEXT_INPUT:
      return {
        type: EQuestionType.TEXT_INPUT,
        required: false,
        hidden: false,
        multiline: false,
      }
    default:
      throw new Error("wrong question type")
  }
}
