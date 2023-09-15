import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContractModel, contractModelSchema } from "./entities/contract.entity";
import { ContractService } from "./contract.service";
import { ContractCron } from "./contract.cron";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContractModel.name, schema: contractModelSchema },
    ]),
  ],
  providers: [ContractService, ContractCron],
})
export class ContractModule {}
