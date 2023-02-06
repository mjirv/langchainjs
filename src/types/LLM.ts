export type Generation = {
  text: string
  generationInfo?: Record<string, any>
}

export type LLMResult = {
  generations: Generation[][]
  llmOutput?: Record<string, any>
}

export interface ILLM {
  generate: (prompts: string[], stop?: string[]) => Promise<LLMResult>
}
