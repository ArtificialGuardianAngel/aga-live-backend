import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserModule } from "src/modules/user/user.module";
import { AdminUserController } from "./controllers/admin-user.controller";
import { ActivityController } from "./controllers/activity.controller";
import { ChatModule } from "src/modules/chat/chat.module";
import { AdminChatController } from "./controllers/admin-chat.controller";
import { StatsController } from "./controllers/stats.controller";
import { ConfigModule } from "@nestjs/config";
import { AdminAuthController } from "./controllers/admin-auth.controller";
import { DeveloperModule } from "../developer/developer.module";
import { AdminDeveloperController } from "./controllers/admin-developer.controller";

@Module({
  imports: [UserModule, ChatModule, ConfigModule, DeveloperModule],
  controllers: [
    AdminUserController,
    ActivityController,
    AdminChatController,
    StatsController,
    AdminAuthController,
    AdminDeveloperController,
  ],
  providers: [AdminService],
})
export class AdminModule {}
