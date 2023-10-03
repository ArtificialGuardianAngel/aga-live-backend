import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";

@Schema()
export class ContractModel {
  @Prop({ unique: true })
  documentId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  revokedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop()
  amount: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  details: Record<string, any>;
}

export type ContractDocument = HydratedDocument<ContractModel>;

export const contractModelSchema = SchemaFactory.createForClass(ContractModel);
