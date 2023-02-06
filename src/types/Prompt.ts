export interface IPrompt {
  format(args: Record<string, string>): string
}

export type TemplateFormat = "f-string" | "jinja2"
