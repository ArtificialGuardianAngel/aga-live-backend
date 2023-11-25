import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { UserModule } from "./modules/user/user.module";
import { RmqModule } from "./core/rmq/rmq.module";
import { extractConfigurationFromConfigService } from "./core/config/common";
import { ChatModule } from "./modules/chat/chat.module";
import { WalletModule } from "./modules/wallet/wallet.module";
import { AuthModule } from "./core/auth/auth.module";
import { MailModule } from "./modules/mail/mail.module";
import { FilesModule } from "./modules/files/files.module";
import { FormModule } from "./modules/form/form.module";
import { AdminModule } from "./modules/admin/admin.module";
import { HappinessModule } from "./modules/happiness/happiness.module";
import { ContractModule } from "./modules/contract/contract.module";
import { DeveloperModule } from "./modules/developer/developer.module";
import { PromptModule } from "./modules/prompt/prompt.module";

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
          query_reply: "RMQ_QUERY_PROMPT_REPLY",
          query: "RMQ_QUERY_PROMPT",
        },
        validate: ["url", "query", "query_reply"],
      }),
    }),
    ScheduleModule.forRoot(),
    MailModule,
    FilesModule,
    FormModule,
    UserModule,
    WalletModule,
    ChatModule,
    AuthModule,
    AdminModule,
    HappinessModule,
    ContractModule,
    DeveloperModule,
    PromptModule,
    RouterModule.register([
      {
        path: "admin",
        module: AdminModule,
      },
      {
        path: "forms",
        module: FormModule,
      },
      {
        path: "files",
        module: FilesModule,
      },
      {
        path: "mail",
        module: MailModule,
      },
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
      {
        path: "happiness",
        module: HappinessModule,
      },
      {
        path: "contract",
        module: ContractModule,
      },
      {
        path: "developer",
        module: DeveloperModule,
      },
      {
        path: "prompt",
        module: PromptModule,
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
