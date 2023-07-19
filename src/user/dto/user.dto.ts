import { ActivityFilterBy } from "src/admin/dto/common";

export class VerifyUserDto {
  code: string;
  email: string;
}

export class AuthorisationDto {
  email: string;
}

export class UserActivityFilterBy extends ActivityFilterBy {}
