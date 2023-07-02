import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntityDocumnet, UserTypeEnum } from "src/entities/user.entity";
import { sign } from "jsonwebtoken";
import { environment } from "src/enviroment";
import { AuthorisationDto, VerifyUserDto } from "./dto/user.dto";
import { AuthGuard } from "./guards/auth.guard";
import { AllowAny, User } from "./guards/auth.decorator";

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @AllowAny()
  @UseGuards(AuthGuard)
  @Post("connect")
  async handleConnect(
    @Body("metadata") metadata: any,
    @User("_id") id?: string,
  ) {
    console.log("connected user", id);
    const user = await this.service.connect(id, metadata);
    return {
      token: sign(user.toObject(), environment.JWT_SECRET_PASSWORD, {
        expiresIn: "30d",
        algorithm: "HS256",
      }),
    };
  }

  @UseGuards(AuthGuard)
  @Post("authorize")
  async handleSignUp(@User("_id") id: string, @Body() data: AuthorisationDto) {
    return this.service.authorisation(id, data);
  }

  @UseGuards(AuthGuard)
  @Post("verify")
  async handleSignIn(
    @User() user: UserEntityDocumnet,
    @Body() data: VerifyUserDto,
  ) {
    return this.service.login(
      data.email,
      data.code,
      user._id as unknown as string,
    );
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async handleMe(@User("_id") id?: string) {
    console.log({ id });
    if (!id) return null;
    const instance = await this.service.findOne(id);
    if (instance.type === UserTypeEnum.anonymous) return null;
    return instance;
  }
}
