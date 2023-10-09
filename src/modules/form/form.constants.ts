export enum FormTypeEnum {
  about = "form-about",
  funds = "form-funds",
  contract = "boldsign-contract",
}
export const SLACK_CHANNELS: Record<FormTypeEnum, string> = {
  [FormTypeEnum.about]: "web-notifications",
  [FormTypeEnum.funds]: "web-notifications",
  [FormTypeEnum.contract]: "aga-wishes-contracts",
};
