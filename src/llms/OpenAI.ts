import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai"
import { LLM } from "./LLM"

type Options = Omit<CreateCompletionRequest, "prompt" | "suffix">

/**
 * OpenAILLM
 *
 * An implementation of LLM interface which communicates with OpenAI API for completion tasks.
 *
 * @export
 * @class OpenAILLM
 * @implements {LLM}
 */
export class OpenAILLM implements LLM {
  private client: OpenAIApi
  private options: Options

  /**
   * Creates an instance of OpenAILLM.
   *
   * @param {string} apiKey The OpenAI API key
   * @param {Params} options The parameters required to initialize OpenAILLM
   * @throws {Error} If no OpenAI API key or model name is provided
   * @memberof OpenAILLM
   */
  constructor(apiKey: string, options: Options) {
    if (!apiKey) {
      throw new Error("No OpenAI API key provided")
    }
    if (!options.model) {
      throw new Error("No model name provided")
    }
    const configuration = new Configuration({
      apiKey,
    })
    this.options = options
    this.client = new OpenAIApi(configuration)
  }

  /**
   * Gets the completion for the given prompt.
   *
   * @param {string} prompt The prompt to get completion for
   * @param {( { suffix?: string; stop?: string } )} [options={}] Optional parameters for the completion request.
   * @returns {Promise<string>} The completion received from OpenAI API
   * @throws {Error} If invalid request is made to OpenAI API, or no completion is received.
   * @memberof OpenAILLM
   */
  async getCompletion(
    prompt: string,
    options?: { suffix?: string; stop?: string }
  ): Promise<string> {
    console.debug(`OpenAI query started`, prompt)
    const response = await this.client.createCompletion({
      ...this.options,
      prompt,
      ...options,
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
