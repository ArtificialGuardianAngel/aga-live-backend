import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { User } from "../entities/user.entity";
import { ClientSession, Connection, Model } from "mongoose";
import { Chat } from "../entities/prompt.entity";
import { WalletService } from "src/wallet/wallet.service";
import { ID } from "src/types";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly model: Model<Chat>,
    private readonly walletSerivce: WalletService,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  create(userId: ID) {
    const instance = new this.model({ creator: userId });
    return instance.save();
  }

  async findById(id: ID) {
    const instnace = await this.model.findById(id);
    return instnace;
  }

  async findByIdAndCreator(id: ID, userId: ID) {
    const instnace = await this.model.findOne({ _id: id, creator: userId });
    return instnace;
  }
  async findByIdOrCreate(id: ID, userId: ID, session?: ClientSession) {
    const instnace = await this.model.findOne(
      { _id: id, creator: userId },
      null,
      { session },
    );
    if (!instnace) {
      return this.create(userId);
    }
    return instnace;
  }

  async findLastChat(userId: ID) {
    const data = await this.model
      .find({ creator: userId })
      .sort({ updatedAt: -1 })
      .limit(1);
    console.log(data);
    return data[0] ? data[0] : this.create(userId);
  }

  async findLastChats(userId: ID) {
    const data = await this.model
      .find({ creator: userId })
      .select(["updatedAt", "createdAt"])
      .sort({ updatedAt: -1 });
    return data;
  }

  async handlePrompt(userId: ID) {
    const session = await this.connection.startSession();
    try {
      await session.startTransaction();
      const wallet = await this.walletSerivce.findOneByIdOrUserId(userId);
      if (!wallet) {
        await session.endSession();
        return;
      }
      await this.walletSerivce.addToBalance(
        wallet._id,
        Number(this.configService.getOrThrow("MINING_COINS_PER_QUERY")),
        session,
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
    } finally {
      await session.endSession();
    }
  }
}
