import {
  Body,
  Controller,
  BadRequestException,
  UnauthorizedException,
  Post,
  Res,
  Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import crypto from "crypto";
import { AdminService } from "../admin.service";

@Controller("auth")
export class AdminAuthController {
  constructor(private readonly adminService: AdminService) {}

  @Post("login")
  handleLogin(
    @Res({ passthrough: true }) response: Response,
    @Body("code") dto: string,
  ) {
    if (this.adminService.confirmPassword(dto)) {
      response.cookie(
        "pwd",
        crypto.createHash("md5").update(dto).digest("hex"),
      );
      return { message: "Logged" };
    }
    throw new BadRequestException("Bad credits");
  }

  @Post("me")
  handleMe(@Req() request: Request) {
    if (!request.cookies || !request.cookies["pwd"])
      throw new UnauthorizedException("No password");
    const cookiePwdHash = request.cookies["pwd"];
    if (this.adminService.compareHashes(cookiePwdHash))
      return { message: "Ok" };
    throw new UnauthorizedException("Bad password");
  }
}
