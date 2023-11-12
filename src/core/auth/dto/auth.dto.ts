export class VerifyUserDto {
  code: string;
  email: string;
}

export class AuthorisationDto {
  email: string;
}

export class WalletDto {
  email?: string;
  password: string;
}
