import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class ContractModel {
  @Prop({ unique: true })
  documentId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  revokedAt: Date;
}

export type ContractDocument = HydratedDocument<ContractModel>;

export const contractModelSchema = SchemaFactory.createForClass(ContractModel);
