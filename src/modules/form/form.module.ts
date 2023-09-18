import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FormService } from "./form.service";
import { FormController } from "./form.controller";
import { MailModule } from "src/modules/mail/mail.module";

@Module({
  imports: [ConfigModule, MailModule],
  providers: [FormService],
  controllers: [FormController],
})
export class FormModule {}
