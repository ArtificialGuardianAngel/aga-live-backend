import { EmailTypeEnum } from "./mail.interfaces";

export const MAIL_SUBJECTS: Record<EmailTypeEnum, string> = {
  [EmailTypeEnum.onetime]: "AGA verification code", //external
  [EmailTypeEnum.funds]: "New sponsor", //
  [EmailTypeEnum.about]: "New volounteer", //
};
