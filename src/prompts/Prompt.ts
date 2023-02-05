import { LLM } from "llms/LLM"

export interface Prompt<T> {
  getPrompt: (params: any) => Promise<string>
  run: (llm: LLM, params: any) => Promise<T>
}
