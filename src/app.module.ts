import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { RmqModule } from "./rmq/rmq.module";
import { extractConfigurationFromConfigService } from "./config/common";
import { ChatModule } from "./chat/chat.module";

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
    ChatModule,
    RouterModule.register([
      {
        path: "user",
        module: UserModule,
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
