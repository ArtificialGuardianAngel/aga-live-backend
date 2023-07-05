import { Injectable } from "@nestjs/common";
import fs from "fs/promises";
import path from "path";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import Mail from "nodemailer/lib/mailer";
import MailComposer from "nodemailer/lib/mail-composer";
import { compile } from "handlebars";
import { EmailTypeEnum } from "./mail.interfaces";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const TOKEN_PATH = path.resolve("config/google_token.json");
const CREDENTIALS_PATH = path.resolve("config/google_credits.json");

@Injectable()
export class MailService {
  constructor() {
    this.authorize();
  }
  private async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content as unknown as string);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }
  private async saveCredentials(client: JSONClient) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content as unknown as string);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }
  private async authorize() {
    console.log("Authorizing");
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client as unknown as string;
    }
    client = (await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    })) as JSONClient;
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client as unknown as string;
  }

  private encodeMessage(message: Buffer) {
    return Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  private async createMail(options: Mail.Options) {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return this.encodeMessage(message);
  }

  public async useFormTemplate(
    type: EmailTypeEnum,
    to: string,
    data: any,
  ): Promise<Mail.Options> {
    const template = await fs.readFile(
      path.join(__dirname, "./templates", `${type}.hbs`),
    );
    return {
      to,
      replyTo: "aga@nuah.org",
      subject: "Contact From Apply",
      html: compile(template.toString())(data),
      textEncoding: "base64",
    };
  }

  public async send(options: Mail.Options) {
    try {
      const auth = await this.authorize();
      const rawMessage = await this.createMail(options);

      const gmail = google.gmail({ version: "v1", auth });
      const {
        data: { id },
      } = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: rawMessage,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
