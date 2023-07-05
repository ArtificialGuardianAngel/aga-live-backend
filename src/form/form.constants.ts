export enum FormTypeEnum {
  about = "form-about",
  funds = "form-funds",
}
export const SLACK_CHANNELS: Record<FormTypeEnum, string> = {
  [FormTypeEnum.about]: "web-notifications",
  [FormTypeEnum.funds]: "aga-fund-form",
};
