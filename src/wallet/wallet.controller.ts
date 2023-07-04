import { Controller, Get, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { User } from "src/auth/guards/auth.decorator";

@Controller()
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @UseGuards(AuthGuard)
  @Get()
  handleGetBalance(@User("_id") id: string) {
    return this.service.findOneByIdOrUserId(id);
  }
}
