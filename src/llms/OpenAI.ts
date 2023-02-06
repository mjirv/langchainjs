import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai"
import type { ILLM, LLMResult } from "types/LLM"
import { LLM } from "./BaseLLM"

type Options = Omit<CreateCompletionRequest, "prompt" | "suffix">

/**
 * OpenAI
 *
 * An implementation of LLM interface which communicates with OpenAI API for completion tasks.
 *
 * @export
 * @class OpenAI
 * @extends {LLM}
 * @implements {ILLM}
 */
export class OpenAI extends LLM implements ILLM {
  private client: OpenAIApi
  private options: Options

  /**
   * Creates an instance of OpenAILLM.
   *
   * @param {string} apiKey The OpenAI API key
   * @param {Params} options The parameters required to initialize OpenAILLM
   * @throws {Error} If no OpenAI API key or model name is provided
   * @memberof OpenAI
   */
  constructor(apiKey: string, options: Options) {
    if (!apiKey) {
      throw new Error("No OpenAI API key provided")
    }
    if (!options.model) {
      throw new Error("No model name provided")
    }
    super()
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
   * @param {string[]} [stop] Optional parameters for the completion request.
   * @returns {Promise<string>} The completion received from OpenAI API
   * @throws {Error} If invalid request is made to OpenAI API, or no completion is received.
   * @memberof OpenAI
   */
  async _call(prompt: string, stop?: string[]): Promise<string> {
    console.debug(`OpenAI query started`, prompt)
    if (stop && this.options.stop) {
      throw new Error("`stop` found in both the input and default params.")
    }
    const response = await this.client.createCompletion({
      stop,
      ...this.options,
      prompt,
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

  /**
   * Gets completions for the given prompts.
   *
   * @param {string[]} prompts The prompt to get completion for
   * @param {string[]} [stop] Optional parameters for the completion request.
   * @returns {Promise<LLMResult>} The completion received from OpenAI API
   * @throws {Error} If invalid request is made to OpenAI API, or no completion is received.
   * @memberof OpenAI
   */
  async generate(
    prompts: string[],
    stop?: string[] | undefined
  ): Promise<LLMResult> {
    return this._generate(prompts, stop)
  }
}
