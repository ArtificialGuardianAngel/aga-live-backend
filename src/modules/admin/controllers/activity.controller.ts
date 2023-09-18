import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/core/auth/guards/admin-auth.guard";
import { ChatService } from "src/modules/chat/chat.service";
import { UserService } from "src/modules/user/user.service";

@UseGuards(AdminAuthGuard)
@Controller("activity")
export class ActivityController {
  constructor(
    private readonly userSerivice: UserService,
    private readonly chatService: ChatService,
  ) {}

  @Post("user")
  handleUsersActivity(@Body() filter: any) {
    return this.userSerivice.activityStats(filter);
  }
  @Post("user/authed")
  handleUsersAuthedActivity(@Body() filter: any) {
    return this.userSerivice.activityStatsAuthAndAnon(filter);
  }
  @Post("user/stats")
  handleUsersStatsActivity() {
    return this.userSerivice.statsAuthedAndAnon();
  }
  @Post("user/:id")
  handleCurrentUserActivity(@Param("id") id: string, @Body() filter: any) {
    return this.chatService.currentUserActivityStats(id, filter);
  }
}
