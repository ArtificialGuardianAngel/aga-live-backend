import { Body, Controller, MessageEvent, Post, Sse } from "@nestjs/common";
import { PromptDTO } from "./dto/prompt.dto";
import { PromptService } from "./prompt.service";
import { Observable } from "rxjs";
import { TogetherStreamResponseBody } from "./types";

@Controller("generate")
export class PromptController {
  constructor(private readonly service: PromptService) {}
  @Post()
  handleGenerate(@Body() dto: PromptDTO) {
    return this.service.prompt(dto);
  }

  @Post("stream")
  @Sse("stream")
  handleStreamingTokens(@Body() dto: PromptDTO): Observable<MessageEvent> {
    const observer = new Observable<MessageEvent>((subscriber) => {
      this.service.promptStream(dto).then((response) => {
        response.data.on("data", (buff: Buffer) => {
          const strs = buff
            .toString()
            .replaceAll("data: ", "")
            .trim()
            .split("\n");
          console.log(buff.toString());

          try {
            for (let i = 0; i < strs.length; i++) {
              const str = strs[i];
              if (!str) continue;
              if (str.startsWith("[DONE]")) continue;
              const data: TogetherStreamResponseBody = JSON.parse(str);
              subscriber.next({
                data: {
                  ...data.choices[0],
                  generated_text: data.generated_text,
                  stats: data.stats,
                },
                id: data.id,
              });
            }
          } catch (error) {
            console.log("Error", strs);
            console.error(error);
          }
        });
        response.data.on("end", () => {
          console.log("done");
          subscriber.complete();
        });
      });
    });

    return observer;
  }
}
