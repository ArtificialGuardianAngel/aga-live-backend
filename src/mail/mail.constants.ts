import { EmailTypeEnum } from "./mail.interfaces";

export const MAIL_SUBJECTS: Record<EmailTypeEnum, string> = {
  "onetime-password": "Confirm your email",
  [EmailTypeEnum.funds]: "New sponsor",
  [EmailTypeEnum.about]: "New volounteer",
};
