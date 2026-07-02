import { describe, expect, it } from "vitest"
import Survey from "@/lib/SurveyCore/survey"

describe("Survey builder", () => {
  it("should create a survey object with correct shapes and empty collections", () => {
    const details = {
      name: "patient survey",
      description: "This is survey for patient experience",
      timer: 10,
    }

    const survey = Survey.builder.createSurvey(details)
    expect(survey.id).toEqual(expect.any(String))
    expect(survey.description).toBe(details.description)
    expect(survey.timer).toBe(details.timer)
    expect(survey.pageOrder).toHaveLength(0)
    expect(survey.pages).toEqual({})
    expect(survey.variables).toHaveLength(0)
    expect
  })
})
