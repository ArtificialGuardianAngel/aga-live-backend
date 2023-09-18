import { Injectable, NotFoundException } from "@nestjs/common";
import { Decimal } from "decimal.js";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { Wallet } from "src/core/entities/wallet.entity";
import { ID } from "src/types";

@Injectable()
export class WalletService {
  private per_day: number;
  private max_per_day: number;
  constructor(
    @InjectModel(Wallet.name) private readonly model: Model<Wallet>,
    private readonly configService: ConfigService,
  ) {
    this.per_day = Number(
      this.configService.getOrThrow("MINING_COINS_PER_QUERY"),
    );
    this.max_per_day = Number(
      this.configService.getOrThrow("MINING_COINS_MAX_PER_DAY"),
    );
  }

  findOneByIdOrUserId(id: ID) {
    return this.model.findOne({ $or: [{ _id: id }, { userId: id }] });
  }

  async findOneById(id: ID) {
    const instance = this.findOneByIdOrUserId(id);
    if (!instance) throw new NotFoundException("Wallet not found");
    return instance;
  }

  create(userId: ID, session?: ClientSession) {
    const instance = new this.model({
      userId,
    });
    return instance.save({ session });
  }

  async addToBalance(id: ID, amount: number, session?: ClientSession) {
    const wallet = await this.findOneById(id);
    const lastIntervalTransactions = [...wallet.transactions]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .splice(0, Math.round(this.max_per_day / this.per_day));

    const lastIntervalTransaction =
      lastIntervalTransactions[lastIntervalTransactions.length - 1];

    const now = Date.now();
    if (
      !lastIntervalTransaction ||
      ((now - new Date(lastIntervalTransaction.createdAt).getTime()) /
        60 /
        60 /
        1000 <=
        24 &&
        lastIntervalTransactions.length < this.max_per_day / this.per_day)
    ) {
      wallet.balance = new Decimal(wallet.balance).plus(amount).toNumber();
      wallet.transactions.push({ value: amount });
    }
    return wallet.save({ session });
  }
}
