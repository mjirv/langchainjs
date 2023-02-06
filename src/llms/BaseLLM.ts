import { Generation, LLMResult } from "types/LLM"

abstract class BaseLLM {
  // Not yet implemented
}

export abstract class LLM extends BaseLLM {
  abstract _call(prompt: string, stop?: string[]): Promise<string>

  protected async _generate(
    prompts: string[],
    stop?: string[]
  ): Promise<LLMResult> {
    const generations: Generation[][] = []
    for (const prompt of prompts) {
      const text = await this._call(prompt, stop)
      generations.push([{ text }])
    }
    return { generations }
  }
}
