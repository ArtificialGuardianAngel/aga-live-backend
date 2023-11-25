import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { PromptDTO } from "./dto/prompt.dto";
import { TogetherResponseBody } from "./types";

const DEFAULT_TAGS = {
  prompt: "INST",
  answer: "s",
};
const DEFAULT_VALUES = {
  model: "togethercomputer/llama-2-70b-chat",
  negative_prompt: "",
  request_type: "language-model-inference",
  temperature: 0.7,
  top_p: 0.7,
  top_k: 50,
  repetition_penalty: 1,
  stream_tokens: false,
  max_tokens: 512,
  stop: ["[/INST]", "</s>"],
  type: "chat",
};

type TogetherResponse = {
  choices: { text: string }[];
  id: string;
};

@Injectable()
export class PromptService {
  client: AxiosInstance;
  constructor(configService: ConfigService) {
    this.client = axios.create({
      baseURL: "https://api.together.xyz",
      headers: {
        Authorization: `Bearer ${configService.getOrThrow("TOGETHER_API_KEY")}`,
      },
    });
  }

  private mapHistoryToPrompt(
    history: PromptDTO["history"],
    prompt: string,
    tags: PromptDTO["tags"],
  ) {
    let res = "";
    for (const conversation of history) {
      res += `<${tags.prompt}>:${conversation[0]}</${tags.prompt}>\n`;
      res += `<${tags.answer}>:${conversation[1]}</${tags.answer}>\n`;
    }
    res += `<${tags.prompt}>:${prompt}</${tags.prompt}>\n`;
    res += `<${tags.answer}>:`;
    return res;
  }

  private mapTagsToStopSeq(tags: PromptDTO["tags"], stop: PromptDTO["stop"]) {
    if (stop) return stop;
    return [`</${tags.answer}>`, `<${tags.prompt}>:`];
  }

  async prompt(dto: PromptDTO) {
    const tags = dto.tags || DEFAULT_TAGS;
    const stop = this.mapTagsToStopSeq(tags, dto.stop);
    const prompt = this.mapHistoryToPrompt(dto.history, dto.prompt, tags);
    try {
      const res = await this.client.post<TogetherResponseBody>("inference", {
        ...DEFAULT_VALUES,
        ...dto.params,
        stop: stop,
        prompt,
      });
      return {
        ...res.data.output.choices[0],
        raw_prompt: prompt + res.data.output.choices[0].text,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      console.log({
        ...DEFAULT_VALUES,
        ...dto.params,
        stop: stop,
        prompt: this.mapHistoryToPrompt(dto.history, dto.prompt, tags),
      });
    }
  }
  promptStream(dto: PromptDTO) {
    const tags = dto.tags || DEFAULT_TAGS;
    const stop = this.mapTagsToStopSeq(tags, dto.stop);
    const prompt = this.mapHistoryToPrompt(dto.history, dto.prompt, tags);
    return {
      response: this.client.post(
        "inference",
        {
          ...DEFAULT_VALUES,
          ...dto.params,
          stop: stop,
          prompt,
          stream_tokens: true,
        },
        { responseType: "stream" },
      ),
      raw_prompt: prompt,
    };
  }
}
