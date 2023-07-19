import { Body, Controller, Param, Post } from "@nestjs/common";
import { ChatService } from "src/chat/chat.service";
import { UserService } from "src/user/user.service";

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
