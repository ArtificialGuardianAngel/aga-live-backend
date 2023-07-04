import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { RmqModule } from "./rmq/rmq.module";
import { extractConfigurationFromConfigService } from "./config/common";
import { ChatModule } from "./chat/chat.module";
import { WalletModule } from "./wallet/wallet.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    RmqModule.forAsyncRoot({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: extractConfigurationFromConfigService({
        template: {
          url: "RMQ_HOST",
        },
        validate: ["url"],
      }),
    }),
    UserModule,
    WalletModule,
    ChatModule,
    AuthModule,
    RouterModule.register([
      {
        path: "user",
        module: AuthModule,
      },
      {
        path: "chat",
        module: ChatModule,
      },
      {
        path: "wallet",
        module: WalletModule,
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
