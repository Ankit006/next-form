export enum EQuestionType {
  TEXT_INPUT = "TEXT_INPUT",
  NUMBER_INPUT = "NUMBER_INPUT",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
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

export type TAnswer =
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
      value: File | string | Array<File> | Array<string> // string for url of the uploaded file in a remote server
    }
  // For MULTI_CHOICE the value hold array of selected choice ids
  | {
      questionType: EQuestionType.MULTIPLE_CHOICE
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

//   "within" is common for all the compare. it is for if a value exists in a set of values
export type TTextInputCompare =
  | "EQUAL"
  | "CONTAINS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "REGEX_MATCH"
  | "WITHIN"

export type TNumberCompare =
  | "EQUAL"
  | "GREATER"
  | "LESSER"
  | "GREATER_THAN_EQUAL"
  | "LESSER_THAN_EQUAL"
  | "WITHIN"

export type TDateTimeCompare =
  | "BEFORE"
  | "AFTER"
  | "EQUALS"
  | "BEFORE_OR_EQUALS"
  | "AFTER_OR_EQUALS"
  | "NOT_EQUAL"

export type TChoiceCompare = "EQUAL" | "WITHIN" | "NOT_WITHIN"

export type TLogicCompares =
  | {
      questionType: EQuestionType.TEXT_INPUT
      comparison: TTextInputCompare
    }
  | {
      questionType:
        | EQuestionType.DATE
        | EQuestionType.DATE_TIME
        | EQuestionType.TIME
      comparison: TDateTimeCompare
    }
  | {
      questionType:
        | EQuestionType.SINGLE_CHOICE
        | EQuestionType.MULTIPLE_CHOICE
        | EQuestionType.MATRIX_MULTI_CHOICE
        | EQuestionType.MATRIX_SINGLE_CHOICE
      comparison: TChoiceCompare
    }
  | {
      questionType: EQuestionType.NUMBER_INPUT
      comparison: TNumberCompare
    }

// Logic only have two type of operator between two matching OR / AND. We have also group multiple
// question matching to group gether and then permon OR / AND comparison between those group.
export interface ILogicInterface {
  // Global group logic is to apply operators between groups. It will only be defined
  // when there is more than one group
  globalGroupOperator?: TGroupOperator
  groups: Array<ILogicGroup>
}

export interface ILogicGroup {
  id: string
  groupOperator: TGroupOperator
  questionComparisons: Array<ILogicCondition>
}

// now in the logical selector I have access to all of the questions in different pages or section.
// I  can bind condition into a question based of other qeustion even if they are completly different section or page.
// Also during logical comparison, variables will be also avaibale to select. based on values stored in the variable can also apply logic

type TConditionSource =
  | {
      source: "QUESTION"
      pageId: string
      sectionId: string
      questionId: string
    }
  | {
      source: "VARIABLE"
      variableId: string
    }
export interface ILogicCondition {
  id: string
  source: TConditionSource
  compares: TLogicCompares
  expectedValue: TAnswer | string | number
}

// complex variable is specially for storing user response for different types of question
export interface ISurveyVariable {
  id: string
  title: string
  value?: string | number
}

type TDateMinMax = { value: Date; errorMsg?: string }
type TInputMinMax = { value: number; errorMsg?: string }

export interface IShuffleConfig {
  enable: boolean
  order?: "RANDOM" | "ALPHABETICAL" | "REVERSE_ALPHABETICAL"
  pinOptionTop?: Array<string> // this takes option Id, if added then the option will always pin to top during randomization. for matrix column it will be left
  pinOptionBottom?: Array<string> // this takes option Id, if added the option will always pin to bottom during randomization. for matrix colum it will be bottom
}

export type TQuestionConfig =
  | {
      type: EQuestionType.DATE_TIME
      maxDate?: TDateMinMax // if enabled then dates after the maxDate will be disabled
      minDate?: TDateMinMax // if enabled then dates before the minDate will be disabled
      rangeDate: boolean // if the calender will take date range or not
      hour24: boolean // if time is in 24 hour format or AM/PM format
      required: boolean
      default?: Date | "CURRENT_DATE_TIME" // this is for if the dateTime input will prefilled by the current date time or any custom date time
      hidden: boolean // hidden question for internal calculation purpose
      disabled: boolean
    }
  | {
      type: EQuestionType.DATE
      maxDate?: TDateMinMax // if enabled then dates after the maxDate will be disabled
      minDate?: TDateMinMax // if enabled then dates before the minDate will be disabled
      rangeDate: boolean // if the calender will take date range or not
      required: boolean
      hidden: boolean // hidden question for internal calculation purpose
      default?: Date | "CURRENT_DATE" // if enable then we can prefilled date input with current date or any custom date
      disabled: boolean
    }
  | {
      type: EQuestionType.TIME
      required: boolean
      hidden: boolean
      hour24: boolean
      startTime?: TDateMinMax
      endTime?: TDateMinMax
      default?: Date | "CURRENT_TIME" // if enabled then prefilled the input with current time or any custom time
      disabled: boolean
    }
  | {
      type: EQuestionType.TEXT_INPUT
      required: boolean
      hidden: boolean
      multiline: boolean
      minLength?: TInputMinMax
      maxLength?: TInputMinMax
      inputType?: "password" | "email" | "phone"
    }
  | {
      type: EQuestionType.NUMBER_INPUT
      required: boolean
      hidden: boolean
      minNum?: TInputMinMax
      maxNum?: TInputMinMax
    }
  | {
      type: EQuestionType.FILE_UPLOAD
      required: boolean
      multiUpload: boolean
      maxUploadFile?: TInputMinMax // without this if multiUpload enable user can upload unlimited docs
    }
  | {
      type: EQuestionType.MATRIX_SINGLE_CHOICE
      required: boolean
      hidden: boolean
      shuffleRow: IShuffleConfig
      shuffleColumn: IShuffleConfig
    }
  | {
      type: EQuestionType.MATRIX_MULTI_CHOICE
      required: boolean
      hidden: boolean
      shuffleRow: IShuffleConfig
      shuffleColumn: IShuffleConfig
      maxRowSelect?: TInputMinMax
      maxColSelect?: TInputMinMax
    }
  | {
      type: EQuestionType.RATING
      required: boolean
      hidden: boolean
      count: number // out of number
    }
  | {
      type: EQuestionType.SINGLE_CHOICE
      required: boolean
      hidden: boolean
      shuffle: IShuffleConfig
    }
  | {
      type: EQuestionType.MULTIPLE_CHOICE
      required: boolean
      hidden: boolean
      shuffle: IShuffleConfig
      maxSelectCount?: TInputMinMax
      minSelectCount?: TInputMinMax
    }
// ------------ Main Survey ---------------------------------

export interface ISurvey {
  id: string
  name: string
  description?: string
  timer?: number // in seconds
  pageOrder: Array<string> // order of pages, this is array of page Id
  pages: Record<string, IPage> // string for page id
  variables?: Array<ISurveyVariable>
}

export interface IPage {
  id: string
  name?: string
  sectionOrder: Array<string> // order of section. holds array of section Id
  sections: Record<string, ISection> // string for sectionId
  jumpLogic?: ILogicInterface
  displayLogic?: ILogicInterface
  terminationLogic?: ILogicInterface
}

export interface ISection {
  id: string
  name?: string
  questionOrder: Array<string> // order of question, holds array of question Id
  questions: Record<string, IQuestion> // string for question id
  jumpLogic?: ILogicInterface
  displayLogic?: ILogicInterface
  terminationLogic?: ILogicInterface
}

export interface IQuestion {
  id: string // UUID
  title: string
  type: EQuestionType
  jumpLogic?: ILogicInterface
  displayLogic?: ILogicInterface
  terminationLogic?: ILogicInterface
  options?: TQuestionOptions
  config: TQuestionConfig
}

export type TRunTimeAnswer = Record<string, TAnswer>
