import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "src/entities/wallet.entity";
import { WalletController } from "./wallet.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Wallet.name,
        useFactory: () => {
          const mySchema = WalletSchema;
          mySchema.pre("save", function (next) {
            // if (doc.password) ;
            this.updatedAt = new Date();
            next();
          });
          return mySchema;
        },
      },
    ]),
    ConfigModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
