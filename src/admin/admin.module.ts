import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserModule } from "src/user/user.module";
import { AdminUserController } from "./controllers/admin-user.controller";
import { ActivityController } from "./controllers/activity.controller";
import { ChatModule } from "src/chat/chat.module";
import { AdminChatController } from "./controllers/admin-chat.controller";
import { StatsController } from "./controllers/stats.controller";
import { ConfigModule } from "@nestjs/config";
import { AdminAuthController } from "./controllers/admin-auth.controller";

@Module({
  imports: [UserModule, ChatModule, ConfigModule],
  controllers: [
    AdminUserController,
    ActivityController,
    AdminChatController,
    StatsController,
    AdminAuthController,
  ],
  providers: [AdminService],
})
export class AdminModule {}
