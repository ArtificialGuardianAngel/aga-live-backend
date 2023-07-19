import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model } from "mongoose";
import { AdminGetUsersDto } from "src/admin/dto/user.dto";
import { User, UserTypeEnum } from "src/entities/user.entity";
import { GroupFilter, ID } from "src/types";
import { UserActivityFilterBy } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async create(metadata?: any) {
    const instance = new this.model({ metadata });
    return instance.save();
  }

  async findOne(id: ID, session?: ClientSession) {
    const instance = await this.model.findOne(
      {
        $or: [{ _id: id }, { deviceId: id }],
      },
      null,
      { session },
    );

    return instance;
  }

  async findOneByEmail(email: string, session?: ClientSession) {
    const instance = await this.model.findOne(
      {
        email,
      },
      null,
      { session },
    );

    return instance;
  }
  async getAllUsers(dto: AdminGetUsersDto) {
    const list = await this.model
      .find(dto.find, null, { skip: dto.skip, limit: dto.take })
      .sort(dto.sort);
    const total = await this.model.count();
    return { list, total };
  }

  async activityStats(filterBy: UserActivityFilterBy) {
    const group: Partial<GroupFilter> = {};
    if (filterBy.options.hour) group["hour"] = { $hour: "$updatedAt" };
    if (filterBy.options.day) group["day"] = { $dayOfMonth: "$updatedAt" };
    if (filterBy.options.month) group["month"] = { $month: "$updatedAt" };
    if (filterBy.options.year) group["year"] = { $year: "$updatedAt" };

    const result = await this.model.aggregate([
      {
        $group: {
          _id: group,
          count: { $sum: 1 },
        },
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
  async statsAuthedAndAnon() {
    const authed = (await this.model.find({ type: UserTypeEnum.authed }))
      .length;
    const total = await this.model.count();
    return {
      total: total,
      authed,
    };
  }
  async activityStatsAuthAndAnon(filterBy: UserActivityFilterBy) {
    const group: Partial<GroupFilter> = {};
    if (filterBy.options.hour) group["hour"] = { $hour: "$updatedAt" };
    if (filterBy.options.day) group["day"] = { $dayOfMonth: "$updatedAt" };
    if (filterBy.options.month) group["month"] = { $month: "$updatedAt" };
    if (filterBy.options.year) group["year"] = { $year: "$updatedAt" };

    const result = await this.model.aggregate([
      {
        $match: {
          type: UserTypeEnum.authed,
        },
      },
      {
        $group: {
          _id: group,
          count: { $sum: 1 },
        },
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
}
