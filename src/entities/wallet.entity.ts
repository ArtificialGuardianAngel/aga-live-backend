import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { UserEntity } from "./user.entity";

@Schema()
export class Wallet {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "UserEntity" })
  userId: UserEntity;

  @Prop()
  balance: number;

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type WalletDocument = HydratedDocument<Wallet>;

export const WalletSchema = SchemaFactory.createForClass(Wallet);
