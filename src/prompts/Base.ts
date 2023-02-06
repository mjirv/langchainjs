import { IPrompt, TemplateFormat } from "types/Prompt"

const fStringFormatter = (text: string, args: Record<string, string>) => {
  let textToReturn = text
  Object.keys(args).forEach((key) => {
    textToReturn = textToReturn.replaceAll(`{key}`, args[key])
  })
  return textToReturn
}

const jinja2Formatter = (): string => {
  throw new Error(`Jinja2 formatter not yet implemented`)
}

export const DEFAULT_FORMATTER_MAPPING: Record<
  TemplateFormat,
  (text: string, args: Record<string, string>) => string
> = {
  "f-string": fStringFormatter,
  jinja2: jinja2Formatter,
}

export abstract class BasePromptTemplate implements IPrompt {
  inputVariables: string[]

  constructor({ inputVariables }: { inputVariables: string[] }) {
    this.inputVariables = inputVariables
  }
  abstract format(args: Record<string, string>): string
}
