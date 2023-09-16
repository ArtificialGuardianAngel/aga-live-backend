import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContractModel, contractModelSchema } from "./entities/contract.entity";
import { ContractService } from "./contract.service";
import { ContractCron } from "./contract.cron";
import { ContractController } from "./contract.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: ContractModel.name, schema: contractModelSchema },
    ]),
  ],
  providers: [ContractService, ContractCron],
  controllers: [ContractController],
})
export class ContractModule {}
