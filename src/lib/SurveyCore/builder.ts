import { v4 as uuid } from "uuid"
import {
  createQuestionDefaultConfig,
  getLogicalCompare,
  getLogicalCompareForVariable,
  getQuestion,
} from "./surveyUtils"
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
  createQeustion(title: string, type: EQuestionType): IQuestion {
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
    pages,
    expectedValue,
  }: {
    source:
      | {
          source: "QUESTION"
          pageId?: string
          sectionId?: string
          questionId: string
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
    pages: Record<string, IPage>
    expectedValue: TLogicExpectedValue
  }): ILogicCondition {
    if (source.source === "QUESTION") {
      const question = getQuestion({
        pages,
        pageId: source.pageId,
        sectionId: source.sectionId,
        questionId: source.questionId,
      })

      const logicCondition: ILogicCondition = {
        id: uuid(),
        source: {
          source: "QUESTION",
          pageId: question.pageId,
          sectionId: question.sectionId,
          questionId: question.question.id,
        },
        compares: getLogicalCompare(question.question.type, compare),
        expectedValue,
      }

      return logicCondition
    } else {
      const logicalCondition: ILogicCondition = {
        id: uuid(),
        source,
        compares: getLogicalCompareForVariable(
          source.dataType,
          compare as TTextInputCompare | TNumberCompare
        ),
        expectedValue,
      }
      return logicalCondition
    }
  },
}

export default builder
