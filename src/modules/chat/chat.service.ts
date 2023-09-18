import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { ClientSession, Connection, Model } from "mongoose";
import { Chat } from "src/core/entities/prompt.entity";
import { WalletService } from "src/modules/wallet/wallet.service";
import { GroupFilter, ID } from "src/types";
import { ConfigService } from "@nestjs/config";
import { ActivityFilterBy } from "src/modules/admin/dto/common";
import { ObjectId } from "bson";
import { Filter } from "src/modules/admin/dto/user.dto";

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
    return data[0] ? data[0] : this.create(userId);
  }

  async findLastChats(userId: ID) {
    const data = await this.model
      .find({ creator: userId })
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

  async getAll(filter: Filter) {
    const list = await this.model
      .find(filter.find, null)
      .sort(filter.sort)
      .skip(filter.skip)
      .limit(filter.take);
    const total = await this.model.count();

    return { list, total };
  }

  async currentUserActivityStats(id: ID, filterBy: ActivityFilterBy) {
    const group: Partial<GroupFilter> = {};
    if (filterBy.options.hour) group["hour"] = { $hour: "$updatedAt" };
    if (filterBy.options.day) group["day"] = { $dayOfMonth: "$updatedAt" };
    if (filterBy.options.month) group["month"] = { $month: "$updatedAt" };
    if (filterBy.options.year) group["year"] = { $year: "$updatedAt" };

    const result = await this.model.aggregate([
      {
        $match: { creator: new ObjectId(id) },
      },
      {
        $group: { _id: group, count: { $sum: 1 } },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
          "_id.day": -1,
        },
      },
    ]);

    const min = filterBy.range[0];
    const max = filterBy.range[1];
    const diffInTime = new Date(max).getTime() - new Date(min).getTime();
    const diffInDays = diffInTime / (1e5 * 36 * 24) + 1;

    const arr = Array.from({ length: diffInDays }, (_, i) => {
      const date = new Date(min);
      date.setDate(date.getDate() + i);
      return {
        _id: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
        count: 0,
      };
    });
    return arr.reduce((_arr, e, i) => {
      const prevEl = i === 0 ? e : _arr[i - 1];
      const inStats = result.find(
        (el) =>
          el._id.year === e._id.year &&
          el._id.month === e._id.month &&
          el._id.day === e._id.day,
      );
      return _arr.concat({
        _id: {
          year: e._id.year,
          month: e._id.month,
          day: e._id.day,
        },
        count: prevEl.count + (inStats?.count || 0),
      });
    }, []);
  }

  async getTotalChats() {
    return this.model.count();
  }
  async getAvgChatsPerDay() {
    const total = await this.getTotalChats();

    const oldestChat = await this.model.find().sort({ createdAt: 1 }).limit(1);
    const oldestDate = new Date(oldestChat[0].createdAt);

    const today = new Date();
    const diffInTime = Math.abs(today.getTime() - oldestDate.getTime());
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

    return total / diffInDays;
  }
}
