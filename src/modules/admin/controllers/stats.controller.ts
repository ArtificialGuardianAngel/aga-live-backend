import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/core/auth/guards/admin-auth.guard";
import { ChatService } from "src/modules/chat/chat.service";
import { UserService } from "src/modules/user/user.service";

@UseGuards(AdminAuthGuard)
@Controller("stats")
export class StatsController {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  @Get("users/active")
  handleActiveUsers() {
    return this.userService.getActiveUsers();
  }

  @Get("users/avg")
  handleAvgUsers() {
    return this.userService.getAvgUsersPerDay();
  }

  @Get("chats/total")
  handleTotalChats() {
    return this.chatService.getTotalChats();
  }
  @Get("chats/avg")
  handleAvgChatsPerDay() {
    return this.chatService.getAvgChatsPerDay();
  }
}
