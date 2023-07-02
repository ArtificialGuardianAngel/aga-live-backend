import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { UserEntity } from "./user.entity";

@Schema()
export class PromptEntity {
  @Prop()
  input: string;

  @Prop()
  output?: string;

  @Prop({ default: 0 })
  timestamp: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "UserEntity" })
  creator: UserEntity;
}

export type PromptEntityDocumnet = HydratedDocument<PromptEntity>;
export const PromptEntitySchema = SchemaFactory.createForClass(PromptEntity);
