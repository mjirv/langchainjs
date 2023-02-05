import { LLM } from "llms/LLM"
import { Prompt } from "prompts/Prompt"

type Params<T> = {
  query: string
  types: string
  possibilities: Partial<Record<keyof T, Record<string, unknown>[]>>
  notes?: string[]
  context?: string
  typeName: string
}

class ObjectFromTypePrompt<T extends Record<string, unknown>>
  implements Prompt<T>
{
  async getPrompt(params: Params<T>): Promise<string> {
    return `${Object.keys(params.possibilities)
      .map(
        (key) =>
          `Available ${key}: ${JSON.stringify(
            params.possibilities[key as keyof T]
          )}`
      )
      .join("\n")}

${params.types}

Translate the following query into a ${
      params.typeName
    } type represented as a JSON string:
Query: "${params.query}"

Note: the current date is ${new Date().toISOString().split("T")[0]}
${params.notes?.map((note) => `Note: ${note}`).join("\n")}
${params.context ? `Context: ${params.context}` : ""}
${params.typeName}: \``
  }

  async run(llm: LLM, params: Params<T>): Promise<T> {
    console.debug(`OpenAI generateObjectFromType query started`)

    const response = await llm.getCompletion(await this.getPrompt(params), {
      suffix: "`",
      stop: "`",
    })
    return JSON.parse(response) as T
  }
}

export default ObjectFromTypePrompt
