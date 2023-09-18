import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "src/modules/user/user.module";
import { AuthController } from "./auth.controller";
import { WalletModule } from "src/modules/wallet/wallet.module";
import { MailModule } from "src/modules/mail/mail.module";

@Module({
  imports: [UserModule, WalletModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
