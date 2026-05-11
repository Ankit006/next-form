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
  title: string
  type: QuestionType
}

export enum QuestionType {
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
