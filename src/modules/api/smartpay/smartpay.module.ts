import { Module } from "@nestjs/common";
import { SmartpayService } from "./smartpay.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [SmartpayService],
  exports: [SmartpayService],
})
export class SmartpayModule {}
