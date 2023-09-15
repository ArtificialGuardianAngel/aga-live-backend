import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  DeveloperModel,
  developerModelSchema,
} from "./entities/developer.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeveloperModel.name, schema: developerModelSchema },
    ]),
  ],
})
export class DeveloperModule {}
