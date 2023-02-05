export interface LLM {
  getCompletion: (
    prompt: string,
    options?: { suffix?: string; stop?: string }
  ) => Promise<string>
}
