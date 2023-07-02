import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PromptEntity, PromptEntitySchema } from "src/entities/prompt.entity";
import { UserEntity, UserEntitySchema } from "src/entities/user.entity";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserEntitySchema,
      },
      {
        name: PromptEntity.name,
        schema: PromptEntitySchema,
      },
    ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
