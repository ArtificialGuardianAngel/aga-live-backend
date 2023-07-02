import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserEntity, UserTypeEnum } from "src/entities/user.entity";
import { AuthorisationDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private readonly model: Model<UserEntity>,
  ) {}

  async create(metadata?: any) {
    const instance = new this.model({ metadata });
    return instance.save();
  }

  async findOne(id: string | Types.ObjectId) {
    const instance = await this.model.findOne({
      $or: [{ _id: id }, { deviceId: id }],
    });

    return instance;
  }

  async connect(id: string, metadata?: any) {
    const instance = await this.findOne(id);
    if (!instance) return this.create(metadata);
    if (instance.metadata)
      instance.metadata = { ...instance.metadata, ...metadata };

    return instance.save();
  }

  async authorisation(id: string, data: AuthorisationDto) {
    const instance = await this.findOne(id);
    let code: string;
    if (!instance) throw new NotFoundException("User not found");
    if (
      !instance.email ||
      instance.email.toLocaleLowerCase() !== data.email.toLocaleLowerCase()
    ) {
      // user mb already registered
      // delete instance, find previous instance
      const emailedInstance = await this.model.findOne({ email: data.email });
      if (!emailedInstance) {
        // user is not registered
        instance.email = data.email;
        await instance.save();
        const savedData = await this.findOne(instance._id);
        // send instance.code
        code = savedData.code;
      } else {
        await instance.deleteOne();
        // send emailedInstance.code
        code = emailedInstance.code;
      }
      // send instance.code
    } else code = instance.code;
    console.log("code", code);
    return code;
  }

  async login(email: string, code: string, id: string) {
    const instance = await this.findOne(id);
    if (!instance) throw new NotFoundException();
    console.log("[instance.code]:", instance.code, "[code]:", code);
    if (instance.code !== code || instance.email !== email)
      throw new UnauthorizedException("Provided credits is not valid");
    instance.type = UserTypeEnum.authed;
    return instance.save();
  }
}
