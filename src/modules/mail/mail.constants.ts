import { EmailTypeEnum } from "./mail.interfaces";

export const MAIL_SUBJECTS: Record<EmailTypeEnum, string> = {
  [EmailTypeEnum.onetime]: "A.G.A EMAIL VERIFICATION CODE", //external
  [EmailTypeEnum.funds]: "New sponsor", //
  [EmailTypeEnum.about]: "New volounteer", //
};
