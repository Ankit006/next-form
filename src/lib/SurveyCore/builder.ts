import { v4 as uuid } from "uuid"
import { createQuestionDefaultConfig } from "./surveyUtils"
import type {
  EQuestionType,
  ILogicInterface,
  IPage,
  IQuestion,
  ISection,
  ISurvey,
  TGroupOperator,
} from "./surveyCore"

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
  createQeustion({
    title,
    type,
  }: {
    title: string
    type: EQuestionType
  }): IQuestion {
    const question: IQuestion = {
      id: uuid(),
      title,
      type,
      config: createQuestionDefaultConfig(type),
    }
    return question
  },

  // this is for creating default logic. For example let's say in the UI user toggle one of the logic section. by default this object will be created without any condition in it //
  createJumpLogic({
    groupOperator,
  }: {
    groupOperator: TGroupOperator
  }): ILogicInterface {
    const logicGroup: ILogicInterface = {
      groups: [
        {
          id: uuid(),
          groupOperator,
          questionComparisons: [],
        },
      ],
    }
    return logicGroup
  },
}

export default builder
