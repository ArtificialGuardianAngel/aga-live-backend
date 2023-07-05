import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { WalletModule } from "../wallet/wallet.module";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [UserModule, WalletModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
