import { IPrompt, TemplateFormat } from "types/Prompt"
import { BasePromptTemplate, DEFAULT_FORMATTER_MAPPING } from "./Base"

type Params = {
  inputVariables: string[]
  template: string
  templateFormat?: TemplateFormat
  validateTemplate?: boolean
}

export class PromptTemplate extends BasePromptTemplate implements IPrompt {
  private template: string
  private templateFormat: TemplateFormat
  private validateTemplate: boolean
  private promptType = "prompt"

  constructor({
    inputVariables,
    template,
    templateFormat,
    validateTemplate,
  }: Params) {
    super({ inputVariables })
    this.template = template
    this.templateFormat = templateFormat ?? "f-string"
    this.validateTemplate = validateTemplate ?? true
  }

  format(args: Record<string, string>) {
    return DEFAULT_FORMATTER_MAPPING[this.templateFormat](this.template, args)
  }
}
