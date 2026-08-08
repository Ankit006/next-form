import { v4 as uuid } from "uuid"
import type {
  EQuestionType,
  ILogicCondition,
  ILogicGroup,
  ILogicInterface,
  IPage,
  IQuestion,
  ISection,
  ISurvey,
  TChoiceCompare,
  TDateTimeCompare,
  TGroupOperator,
  TLogicExpectedValue,
  TNumberCompare,
  TTextInputCompare,
} from "./surveyInterface"
import {
  createQuestionDefaultConfig,
  getLogicalCompare,
  getLogicalCompareForVariable,
} from "./surveyUtils"

const builder = {
  // ---------------------------//
  createSurvey({
    name,
    description,
    timer,
  }: {
    name: string
    description?: string
    timer?: number
  }): ISurvey {
    const surveyObj: ISurvey = {
      id: uuid(),
      name,
      description,
      timer,
      pageOrder: [],
      pages: {},
      variables: [],
    }

    return surveyObj
  },

  // ------------------------------//

  createPage(pageName?: string): IPage {
    const page: IPage = {
      id: uuid(),
      name: pageName,
      sectionOrder: [],
      sections: {},
    }

    return page
  },

  // ---------------------------- //
  createSection(sectionName?: string): ISection {
    const section: ISection = {
      id: uuid(),
      name: sectionName,
      questionOrder: [],
      questions: {},
    }

    return section
  },

  // ---------------------------- //
  createQuestion(title: string, type: EQuestionType): IQuestion {
    const question: IQuestion = {
      id: uuid(),
      title,
      type,
      config: createQuestionDefaultConfig(type),
    }
    return question
  },

  addLogic(globalGroupOperator?: TGroupOperator): ILogicInterface {
    const logicInterface: ILogicInterface = {
      globalGroupOperator,
      groups: [],
    }

    return logicInterface
  },

  addLogicGroup(groupOperator: TGroupOperator): ILogicGroup {
    const logicalGroup: ILogicGroup = {
      id: uuid(),
      groupOperator,
      questionComparisons: [],
    }

    return logicalGroup
  },

  addLogicCondition({
    source,
    compare,
    expectedValue,
  }: {
    source:
      | {
          source: "QUESTION"
          pageId: string
          sectionId: string
          question: IQuestion
        }
      | {
          source: "VARIABLE"
          variableId: string
          dataType: "string" | "number"
        }
    compare:
      | TTextInputCompare
      | TNumberCompare
      | TDateTimeCompare
      | TChoiceCompare
    expectedValue: TLogicExpectedValue
  }): ILogicCondition {
    if (source.source === "QUESTION") {
      const question = source.question

      const logicCondition: ILogicCondition = {
        id: uuid(),
        source: {
          source: "QUESTION",
          pageId: source.pageId,
          sectionId: source.sectionId,
          questionId: question.id,
        },
        compares: getLogicalCompare(question.type, compare),
        expectedValue,
      }

      return logicCondition
    } else {
      const logicalCondition: ILogicCondition = {
        id: uuid(),
        source,
        compares: getLogicalCompareForVariable(
          source.dataType,
          compare as TTextInputCompare | TNumberCompare,
        ),
        expectedValue,
      }
      return logicalCondition
    }
  },
}

export default builder
