import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserModule } from "src/user/user.module";
import { AdminUserController } from "./controllers/admin-user.controller";
import { ActivityController } from "./controllers/activity.controller";
import { ChatModule } from "src/chat/chat.module";
import { AdminChatController } from "./controllers/admin-chat.controller";

@Module({
  imports: [UserModule, ChatModule],
  controllers: [AdminUserController, ActivityController, AdminChatController],
  providers: [AdminService],
})
export class AdminModule {}
