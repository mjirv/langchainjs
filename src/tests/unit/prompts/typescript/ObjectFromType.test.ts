import ObjectFromTypePrompt from "../../../../prompts/typescript/ObjectFromType"
import { OpenAILLM } from "../../../../llms/OpenAI"

describe("ObjectFromTypePrompt", () => {
  let llm: OpenAILLM
  let objectFromTypePrompt: ObjectFromTypePrompt<Record<string, unknown>>

  beforeEach(() => {
    llm = new OpenAILLM("api-key", { model: "model" })
    objectFromTypePrompt = new ObjectFromTypePrompt()
  })

  test("getPrompt returns the expected prompt string", async () => {
    const params = {
      query: "query",
      types: "types",
      possibilities: {
        key1: [{ value1: "1" }],
        key2: [{ value2: "2" }],
      },
      notes: ["note1", "note2"],
      context: "context",
      typeName: "typeName",
    }

    const expectedPrompt = `Available key1: [{"value1":"1"}]
Available key2: [{"value2":"2"}]

types

Translate the following query into a typeName type represented as a JSON string:
Query: "query"

Note: the current date is 2023-02-05
Note: note1
Note: note2
Context: context
typeName: \``

    const prompt = await objectFromTypePrompt.getPrompt(params)
    expect(prompt).toBe(expectedPrompt)
  })

  test("run returns the expected object", async () => {
    const params = {
      query: "query",
      types: "types",
      possibilities: {
        key1: [{ value1: "1" }],
        key2: [{ value2: "2" }],
      },
      notes: ["note1", "note2"],
      context: "context",
      typeName: "typeName",
    }

    const expectedObject = { key: "value" }

    // Mocking the response from the LLM module
    jest
      .spyOn(llm, "getCompletion")
      .mockResolvedValue(JSON.stringify(expectedObject))

    const result = await objectFromTypePrompt.run(llm, params)
    expect(result).toEqual(expectedObject)
  })
})
