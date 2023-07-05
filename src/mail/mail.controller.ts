import { Controller, Get, Post, Body } from "@nestjs/common";
import { MailService } from "./mail.service";
import { EmailTypeEnum } from "./mail.interfaces";
@Controller()
export class MailController {
  constructor(private readonly service: MailService) {}

  @Post("test")
  async handleTest(@Body("email") email: string) {
    const template = await this.service.useFormTemplate(
      EmailTypeEnum.onetime,
      email,
      { code: "fa6ae975-e5be-49ac-bf77-97cc9b163e98" },
    );
    return this.service.send(template);
  }

  @Post("preview")
  async handlePreview(
    @Body("type") type: EmailTypeEnum,
    @Body("data") data: any,
  ) {
    const template = await this.service.useFormTemplate(
      type,
      "test@test.com",
      data,
    );
    return template.html;
  }
}
