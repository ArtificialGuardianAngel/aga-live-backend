import { IsString } from "class-validator";
export class PromptHistory {
  internal: [string, string][];

  visible: [string, string][];
}
export class PromptParams {
  temperature: number;
  top_p: number;
  top_k: number;
  repetition_penalty: number;
  stop: string[];
  max_tokens: number;
}
export class PromptDTO {
  @IsString()
  prompt: string;

  history: PromptHistory;
  params: PromptParams;
}
