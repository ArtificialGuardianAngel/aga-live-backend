import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { UserModule } from "./user/user.module";
import { RmqModule } from "./rmq/rmq.module";
import { extractConfigurationFromConfigService } from "./config/common";
import { ChatModule } from "./chat/chat.module";
import { WalletModule } from "./wallet/wallet.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { FilesModule } from "./files/files.module";
import { FormModule } from "./form/form.module";
import { AdminModule } from "./admin/admin.module";

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
    ScheduleModule.forRoot(),
    MailModule,
    FilesModule,
    FormModule,
    UserModule,
    WalletModule,
    ChatModule,
    AuthModule,
    AdminModule,
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
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
