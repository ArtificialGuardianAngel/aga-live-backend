import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  DeveloperModel,
  developerModelSchema,
} from "./entities/developer.entity";
import { DeveloperService } from "./developer.service";
import { DeveloperController } from "./developer.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeveloperModel.name, schema: developerModelSchema },
    ]),
  ],
  providers: [DeveloperService],
  controllers: [DeveloperController],
})
export class DeveloperModule {}
