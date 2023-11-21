import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { AuthGuard } from "src/core/auth/guards/auth.guard";
import { User } from "src/core/auth/guards/auth.decorator";
import { WalletDto } from "src/core/auth/dto/auth.dto";

@Controller()
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @UseGuards(AuthGuard)
  @Get()
  handleGetBalance(@User("_id") id: string) {
    return this.service.findOneByIdOrUserId(id);
  }

  @UseGuards(AuthGuard)
  @Post("wallet/connect")
  handleWallet(@User("_id") id: string, @Body() data: WalletDto) {
    return this.service.createWallet(id, data.password, data.email);
  }
}
