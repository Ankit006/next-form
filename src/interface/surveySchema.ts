export enum EQuestionType {
  TEXT_INPUT = "TEXT_INPUT",
  NUMBER_INPUT = "NUMBER_INPUT",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  REPEATABLE_INPUT = "REPEATABLE_INPUT", // user can enter multiple answer for a question just like to do list
  MATRIX_SINGLE_CHOICE = "MATRIX_SINGLE_CHOICE",
  MATRIX_MULTI_CHOICE = "MATRIX_MULTI_CHOICE",
  FILE_UPLOAD = "FILE_UPLOAD",
  MULTI_FILE_UPLOAD = "MULTI_FILE_UPLOAD",
  DATE_TIME = "DATE_TIME",
  DATE = "DATE",
  TIME = "TIME",
  RATING = "RATING",
}

export type TQuestionOptions =
  | {
      questionType: EQuestionType.SINGLE_CHOICE | EQuestionType.MULTIPLE_CHOICE
      options: Array<{ id: string; title: string }>
    }
  | {
      questionType:
        | EQuestionType.MATRIX_MULTI_CHOICE
        | EQuestionType.MATRIX_SINGLE_CHOICE
      rows: Array<{
        id: string
        title: string
        columns: Array<{
          id: string
          title: string
        }>
      }>
    }

export type TQuestionAnswer =
  //  for SINGLE_CHOICE question the value hold the id of the selected choice
  | {
      questionType: EQuestionType.TEXT_INPUT | EQuestionType.SINGLE_CHOICE
      value: string
    }
  | {
      questionType:
        | EQuestionType.TIME
        | EQuestionType.DATE
        | EQuestionType.DATE_TIME
      value: Date
    }
  | {
      questionType: EQuestionType.NUMBER_INPUT | EQuestionType.RATING
      value: number
    }
  | {
      questionType: EQuestionType.FILE_UPLOAD
      value: File | string // string for url of the uploaded file in a remote server
    }
  | {
      questionType: EQuestionType.MULTI_FILE_UPLOAD
      vale: Array<File> | Array<string>
    }
  // For MULTI_CHOICE the value hold array of selected choice ids
  | {
      questionType:
        | EQuestionType.REPEATABLE_INPUT
        | EQuestionType.MULTIPLE_CHOICE
      value: Array<string>
    }
  | {
      questionType: EQuestionType.MATRIX_SINGLE_CHOICE
      value: Array<{ rowId: string; columnId: string }>
    }
  | {
      questionType: EQuestionType.MATRIX_MULTI_CHOICE
      value: Array<{ rowId: string; columnId: Array<string> }>
    }

export type TGroupOperator = "OR" | "AND"

export type TTextInputCompare =
  | "equal"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "regexMatch"

export type TLogicCcompares =
  | {
      questionType: EQuestionType.TEXT_INPUT
      comparison: TTextInputCompare
    }
  | {}

// ------------ Main Survey ---------------------------------

export interface ISurvey {
  name: string
  description: string
  timer?: number // in seconds
  pages: Array<IPage>
}

export interface IPage {
  sections: Array<ISection>
}

export interface ISection {
  name: string
  question: Array<IQuestion>
}

export interface IQuestion {
  id: string // UUID
  title: string
  type: EQuestionType
  jumpLogic: IJumpLogic
  options?: TQuestionOptions
  answer?: {}
}

// Logic only have two type of operator between two matching OR / AND. We have also group multiple
// question matching to group gether and then permon OR / AND comparison between those group.
export interface IJumpLogic {
  // Global group logic is to apply operators between groups. It will only be defined
  // when there is more than one group
  globalGroupOperator?: TGroupOperator
  grops: Array<IJumpLogicGroup>
}

export interface IJumpLogicGroup {
  id: string
  groupLogic: TGroupOperator
  questionComparisons: Array<IJumpLogicQuestionComparisons>
}

export interface IJumpLogicQuestionComparisons {
  id: string
  question: IQuestion
  compares: TLogicCcompares
}
