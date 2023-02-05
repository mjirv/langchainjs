import { OpenAILLM } from "../../../llms/OpenAI"
import { Configuration, OpenAIApi } from "openai"

const createCompletion = jest.fn().mockImplementation(() => ({
  data: {
    choices: [
      {
        text: "completion text",
      },
    ],
  },
}))

jest.mock("openai", () => {
  return {
    OpenAIApi: jest.fn().mockImplementation(() => {
      return {
        createCompletion,
      }
    }),
    Configuration: jest.fn().mockImplementation(() => {
      return {}
    }),
  }
})

describe("OpenAILLM", () => {
  let openAILLM: OpenAILLM

  beforeEach(() => {
    openAILLM = new OpenAILLM("api-key", {
      model: "model-name",
    })
  })

  it("creates an instance of OpenAILLM", () => {
    expect(openAILLM).toBeInstanceOf(OpenAILLM)
    expect(Configuration).toHaveBeenCalledWith({ apiKey: "api-key" })
    expect(OpenAIApi).toHaveBeenCalledWith({})
  })

  it("throws an error if no OpenAI API key is provided", () => {
    expect(() => {
      new OpenAILLM("", { model: "model-name" })
    }).toThrowError("No OpenAI API key provided")
  })

  it("throws an error if no model name is provided", () => {
    expect(() => {
      new OpenAILLM("api-key", { model: "" })
    }).toThrowError("No model name provided")
  })

  it("calls OpenAI API for completion", async () => {
    const result = await openAILLM.getCompletion("prompt")
    expect(createCompletion).toHaveBeenCalledWith({
      model: "model-name",
      prompt: "prompt",
    })
    expect(result).toBe("completion text")
  })

  it("passes suffix and stop options to OpenAI API for completion", async () => {
    const result = await openAILLM.getCompletion("prompt", {
      suffix: "suffix",
      stop: "stop",
    })
    expect(createCompletion).toHaveBeenCalledWith({
      model: "model-name",
      prompt: "prompt",
      suffix: "suffix",
      stop: "stop",
    })
    expect(result).toBe("completion text")
  })

  it("throws an error if no choices are received from OpenAI API", async () => {
    createCompletion.mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      data: {},
    })
    await expect(openAILLM.getCompletion("prompt")).rejects.toThrowError(
      "Invalid request; no choices received from OpenAI"
    )
  })

  it("throws an error if no completion is received from OpenAI API", async () => {
    createCompletion.mockResolvedValue({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: {
        choices: [
          {
            text: "",
          },
        ],
      },
    })
    await expect(openAILLM.getCompletion("prompt")).rejects.toThrowError(
      "Invalid request; no completion received from OpenAI"
    )
  })
})
