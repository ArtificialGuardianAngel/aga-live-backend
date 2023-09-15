import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class ContractModel {
  @Prop({ unique: true })
  documentId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  revokedAt: Date;
}

export const contractModelSchema = SchemaFactory.createForClass(ContractModel);
