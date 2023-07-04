import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [UserModule, WalletModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
