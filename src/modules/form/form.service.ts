import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import slack from "slack";
import { FormTypeEnum, SLACK_CHANNELS } from "./form.constants";
import { MailService } from "src/modules/mail/mail.service";
import { EmailTypeEnum } from "src/modules/mail/mail.interfaces";

@Injectable()
export class FormService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private sendToSlack(type: FormTypeEnum, data: any) {
    slack.chat.postMessage({
      token: this.configService.getOrThrow("SLACK_API_KEY"),
      channel: SLACK_CHANNELS[type],
      text: `${type.toUpperCase().replace("-", " ")}\n\n${JSON.stringify(
        data,
        null,
        2,
      )}`,
    });
  }

  private async sendToEmail(type: FormTypeEnum, data: any) {
    const tempalte = await this.mailService.useFormTemplate(
      type === FormTypeEnum.funds ? EmailTypeEnum.funds : EmailTypeEnum.about,
      "aga@nuah.org",
      data,
    );
    return this.mailService.send(tempalte);
  }

  public async apply(type: FormTypeEnum, data: any) {
    try {
      this.sendToSlack(type, data);
      await this.sendToEmail(type, data);
      return "OK";
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Your request is invalid");
    }
  }
}
