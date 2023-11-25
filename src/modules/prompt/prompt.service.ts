import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from "axios";
import { PromptDTO } from "./dto/prompt.dto";
import { TogetherResponseBody } from "./types";

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
  stop: ["[/INST]", "</s>", "</bot>"],
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

  async prompt(dto: PromptDTO) {
    try {
      const res = await this.client.post<TogetherResponseBody>("inference", {
        ...DEFAULT_VALUES,
        ...dto,
      });
      console.log(res.data);
      return res.data.output.choices[0];
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      console.log({
        ...DEFAULT_VALUES,
        ...dto,
      });
    }
  }
  promptStream(dto: PromptDTO) {
    return this.client.post(
      "inference",
      {
        ...DEFAULT_VALUES,
        ...dto,
        stream_tokens: true,
      },
      { responseType: "stream" },
    );
  }
}
