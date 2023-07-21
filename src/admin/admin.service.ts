import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import slack from "slack";
import crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminService {
  constructor(private readonly configService: ConfigService) {
    this.handleUpdatePassword();
  }
  private password: string;
  @Cron(CronExpression.EVERY_HOUR)
  handleUpdatePassword() {
    this.password = crypto
      .createHash("md5")
      .update(crypto.randomUUID())
      .digest("hex");
    slack.chat.postMessage({
      token: this.configService.getOrThrow("SLACK_API_KEY"),
      channel: "aga-admin-password",
      text: `Password will be updated in next hour\n\`${this.password}\``,
    });
    console.log("Password set", this.password);
  }

  confirmPassword(password: string) {
    return password === this.password;
  }
  compareHashes(hash: string) {
    const pwdPassword = crypto
      .createHash("md5")
      .update(this.password)
      .digest("hex");
    return pwdPassword === hash;
  }
}
