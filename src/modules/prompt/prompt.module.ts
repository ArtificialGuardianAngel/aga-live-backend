import { Module } from "@nestjs/common";
import { PromptService } from "./prompt.service";
import { PromptController } from "./prompt.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [PromptService],
  controllers: [PromptController],
})
export class PromptModule {}
