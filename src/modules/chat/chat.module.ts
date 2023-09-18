import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "src/core/entities/prompt.entity";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { UserModule } from "src/modules/user/user.module";
import { WalletModule } from "src/modules/wallet/wallet.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/core/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Chat.name,
        useFactory: () => {
          const mySchema = ChatSchema;
          mySchema.pre("save", function (next) {
            // if (doc.password) ;
            this.updatedAt = new Date();
            next();
          });
          return mySchema;
        },
      },
    ]),
    AuthModule,
    UserModule,
    WalletModule,
    ConfigModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
