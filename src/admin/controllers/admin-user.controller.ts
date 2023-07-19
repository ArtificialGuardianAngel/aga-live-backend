import { Controller, Post, Body, Param } from "@nestjs/common";
import { AdminGetUsersDto } from "../dto/user.dto";
import { UserService } from "src/user/user.service";

@Controller("user")
export class AdminUserController {
  constructor(private readonly userService: UserService) {}
  @Post("all")
  handleAll(@Body() dto: AdminGetUsersDto) {
    return this.userService.getAllUsers(dto);
  }
  @Post(":id")
  handleGetById(@Param("id") id: string) {
    return this.userService.findOne(id);
  }
}
