import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { User } from "./user.entity";

@Schema({ _id: false })
class WalletTransaction {
  @Prop()
  value: number;

  @Prop({ default: Date.now, required: false })
  createdAt?: Date;
}
@Schema()
export class Wallet {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    unique: true,
  })
  userId: User;

  @Prop({ default: 0 })
  balance: number;

  @Prop([{ type: WalletTransaction }])
  transactions: WalletTransaction[];

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type WalletDocument = HydratedDocument<Wallet>;

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.post("save", (doc, next) => {
  doc.updatedAt = new Date();
  next();
});
