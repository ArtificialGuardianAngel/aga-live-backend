import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HappinessResult, HappinessResultSchema } from "src/entities/result";
import { HappinessService } from "./happiness.service";
import { HappinessController } from "./happiness.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HappinessResult.name, schema: HappinessResultSchema },
    ]),
  ],
  providers: [HappinessService],
  controllers: [HappinessController],
})
export class HappinessModule {}
