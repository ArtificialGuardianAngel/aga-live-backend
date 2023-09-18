import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { AllowAny, User } from "./guards/auth.decorator";
import { AuthService } from "./auth.service";
import { sign } from "jsonwebtoken";
import { environment } from "src/core/enviroment";
import { AuthGuard } from "./guards/auth.guard";
import { UserDocumnet, UserTypeEnum } from "src/core/entities/user.entity";
import { UserService } from "src/modules/user/user.service";
import { AuthorisationDto, VerifyUserDto } from "./dto/auth.dto";

@UseGuards(AuthGuard)
@Controller()
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly userService: UserService,
  ) {}
  @AllowAny()
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

  @Post("authorize")
  async handleSignUp(@User("_id") id: string, @Body() data: AuthorisationDto) {
    const { obj } = await this.service.authorisation(id, data);
    return {
      token: sign(obj.toObject(), environment.JWT_SECRET_PASSWORD, {
        expiresIn: "30d",
        algorithm: "HS256",
      }),
    };
  }

  @Post("verify")
  async handleSignIn(@User() user: UserDocumnet, @Body() data: VerifyUserDto) {
    return this.service.login(
      data.email,
      data.code,
      user._id as unknown as string,
    );
  }

  @Get("me")
  async handleMe(@User("_id") id?: string) {
    console.log({ id });
    if (!id) return null;
    const instance = await this.userService.findOne(id);
    if (instance.type === UserTypeEnum.anonymous || instance.emailForVerify)
      return null;
    return instance;
  }
}
