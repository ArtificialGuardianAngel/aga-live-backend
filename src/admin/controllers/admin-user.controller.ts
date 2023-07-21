import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AdminGetUsersDto } from "../dto/user.dto";
import { UserService } from "src/user/user.service";
import { AdminAuthGuard } from "src/auth/guards/admin-auth.guard";

@UseGuards(AdminAuthGuard)
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
