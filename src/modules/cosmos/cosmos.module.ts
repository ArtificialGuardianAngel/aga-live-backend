import { Module } from "@nestjs/common";
import { CosmosService } from "./cosmos.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  import: [ConfigModule],
  providers: [CosmosService],
  exports: [CosmosService],
})
export class CosmosModule {}
