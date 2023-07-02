import { Controller, Post, Body } from "@nestjs/common";
import * as crypto from "crypto";
import { ChatService } from "./chat.service";

@Controller()
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post("/prompt")
  handlePrompt(@Body("prompt") input: string) {
    // return this.service.handlePrompt(crypto.randomUUID(), input);
    return input;
  }
}
