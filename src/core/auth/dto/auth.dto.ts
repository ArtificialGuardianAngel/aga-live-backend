import { IsString } from "class-validator";

export class VerifyUserDto {
  code: string;
  email: string;
}

export class AuthorisationDto {
  email: string;
}

export class WalletDto {
  @IsString()
  password: string;
}
