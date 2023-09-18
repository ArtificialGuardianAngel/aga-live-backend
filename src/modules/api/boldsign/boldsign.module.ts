import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BoldsignService } from "./boldsign.service";

@Module({
  imports: [ConfigModule],
  providers: [BoldsignService],
  exports: [BoldsignService],
})
export class BoldsignModule {}
