import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { AuthorisationDto } from "./dto/auth.dto";
import { WalletService } from "src/wallet/wallet.service";
import { Connection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { UserTypeEnum } from "src/entities/user.entity";
import { MailService } from "src/mail/mail.service";
import { EmailTypeEnum } from "src/mail/mail.interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly mailService: MailService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async connect(id: string, metadata?: any) {
    const instance = await this.userService.findOne(id);
    if (!instance) return this.userService.create(metadata);
    if (instance.metadata)
      instance.metadata = { ...instance.metadata, ...metadata };

    return instance.save();
  }
  async authorisation(id: string, data: AuthorisationDto) {
    const instance = await this.userService.findOne(id);
    let obj: any;
    let code: string;
    if (!instance) throw new NotFoundException("User not found");
    if (
      !instance.email ||
      instance.email.toLocaleLowerCase() !== data.email.toLocaleLowerCase()
    ) {
      // user mb already registered
      // delete instance, find previous instance
      const emailedInstance = await this.userService.findOneByEmail(data.email);
      if (!emailedInstance) {
        // user is not registered
        instance.emailForVerify = data.email;
        await instance.save();
        const savedData = await this.userService.findOne(instance._id);
        // send instance.code
        obj = savedData;
        code = savedData.code;
      } else {
        await instance.deleteOne();
        // send emailedInstance.code
        obj = emailedInstance;
        code = emailedInstance.code;
      }
      // send instance.code
    } else {
      code = instance.code;
      obj = instance;
    }
    try {
      const template = await this.mailService.useFormTemplate(
        EmailTypeEnum.onetime,
        data.email,
        { code },
      );
      await this.mailService.send(template);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        "Cant send an email with onetime password",
      );
    }
    console.log({ code });
    return { obj };
  }
  async login(email: string, code: string, id: string) {
    const session = await this.connection.startSession();
    try {
      await session.startTransaction();
      const instance = await this.userService.findOne(id, session);
      if (!instance) throw new NotFoundException();
      if (instance.code !== code || instance.emailForVerify !== email)
        throw new UnauthorizedException("Provided credits is not valid");
      instance.type = UserTypeEnum.authed;
      if (!instance.email) instance.email = email;
      instance.emailForVerify = null;

      await this.walletService.create(instance._id, session);
      const data = await instance.save({ session });

      await session.commitTransaction();
      await session.endSession();
      return data;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  }
}
