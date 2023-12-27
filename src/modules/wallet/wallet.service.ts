import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Decimal } from "decimal.js";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { Wallet } from "src/core/entities/wallet.entity";
import { ID } from "src/types";
import { UserService } from "../user/user.service";
import { CosmosService } from "../cosmos/cosmos.service";

@Injectable()
export class WalletService {
  private per_day: number;
  private max_per_day: number;
  constructor(
    @InjectModel(Wallet.name) private readonly model: Model<Wallet>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cosmosService: CosmosService,
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

  async create(userId: ID, rest?: Partial<Wallet>, session?: ClientSession) {
    const createdInstance = await this.model.findOne({ userId });
    if (!createdInstance) {
      const instance = new this.model({
        userId,
        ...rest,
      });
      return instance.save({ session });
    }
    return createdInstance;
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

  async createWallet(id: string, password: string, email?: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException("User not found");
    const userEmail = user?.email || email;
    if (!userEmail) throw new BadRequestException("U need to provide email");
    if (email) {
      user.email = email;
      await user.save();
    }
    console.log("password", password);
    const {
      cipherMnemonic,
      keyHash,
      wallet: _wallet,
    } = await this.cosmosService.createWallet(userEmail, password);
    let wallet = await this.findOneByIdOrUserId(user.id);
    if (!wallet) wallet = await this.create(user.id);
    wallet.mnemonicHashed = cipherMnemonic;
    wallet.passwordHash = keyHash;
    await wallet.save();
    return {
      mnemonic: _wallet.mnemonic,
    };
  }

  async connectToWallet(id: string, password: string) {
    console.log(id, password);
    const user = await this.userService.findOne(id);
    const wallet = await this.findOneByIdOrUserId(id);
    if (!user) throw new BadRequestException("User not found");
    if (!wallet || !wallet.mnemonicHashed)
      return this.createWallet(id, password);
    // throw new BadRequestException("User should have a valid account");

    console.log(password, user.email);

    const { mnemonic } = await this.cosmosService.getWalletMnemonic(
      user.email,
      password,
      wallet,
    );

    return { mnemonic };
  }
}
