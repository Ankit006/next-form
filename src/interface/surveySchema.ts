export enum EQuestionType {
  TEXT_INPUT = "TEXT_INPUT",
  NUMBER_INPUT = "NUMBER_INPUT",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  REPEATABLE_INPUT = "REPEATABLE_INPUT", // user can enter multiple answer for a question just like to do list
  MATRIX_SINGLE_CHOICE = "MATRIX_SINGLE_CHOICE",
  MATRIX_MULTI_CHOICE = "MATRIX_MULTI_CHOICE",
  FILE_UPLOAD = "FILE_UPLOAD",
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
