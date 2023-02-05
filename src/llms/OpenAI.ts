import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai"
import { LLM } from "./LLM"

type Params = Omit<CreateCompletionRequest, "prompt" | "suffix">

export class OpenAILLM implements LLM {
  private client: OpenAIApi
  private params: Params

  constructor(params: Params) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("No OpenAI API key provided")
    }
    if (!params.model) {
      throw new Error("No model name provided")
    }
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.params = params
    this.client = new OpenAIApi(configuration)
  }

  async getCompletion(
    prompt: string,
    options?: { suffix?: string; stop?: string }
  ): Promise<string> {
    console.debug(`OpenAI query started`, prompt)
    const response = await this.client.createCompletion({
      ...this.params,
      prompt,
      ...(options?.suffix ? { suffix: options.suffix } : {}),
      ...(options?.stop ? { suffix: options.stop } : {}),
    })
    if (!response.data.choices) {
      throw new Error("Invalid request; no choices received from OpenAI")
    }
    const [{ text }] = response.data.choices
    if (!text) {
      throw new Error("Invalid request; no completion received from OpenAI")
    }
    console.debug(`OpenAI query finished successfully`, text)
    return text
  }
}
