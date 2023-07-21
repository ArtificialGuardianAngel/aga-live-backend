import { Controller, Post, Param, Body, UseGuards } from "@nestjs/common";
import { ChatService } from "src/chat/chat.service";
import { Filter } from "../dto/user.dto";
import { AdminAuthGuard } from "src/auth/guards/admin-auth.guard";

@UseGuards(AdminAuthGuard)
@Controller("chat")
export class AdminChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("all")
  handleAll(@Body() filter: Filter) {
    return this.chatService.getAll(filter);
  }
  @Post("user/:id")
  handleByUserId(@Param("id") userId: string) {
    return this.chatService.findLastChats(userId);
  }

  @Post(":id")
  handleById(@Param("id") id: string) {
    return this.chatService.findById(id);
  }
}
