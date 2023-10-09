import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ContractDocument, ContractModel } from "./entities/contract.entity";
import { Model } from "mongoose";
import { ID } from "src/types";
import { ConfigService } from "@nestjs/config";
import slack from "slack";
import { SendDocumentToDto } from "../api/boldsign/dto/send.doc.dto";
import { BoldsignService } from "../api/boldsign/boldsign.service";
import {
  BoldsignDocumentStatus,
  BoldsingDocumentListResponseResultItem,
} from "../api/boldsign/types";
import moment from "moment";
import { SmartpayService } from "../api/smartpay/smartpay.service";
import { FormTypeEnum, SLACK_CHANNELS } from "../form/form.constants";

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(ContractModel.name)
    private readonly model: Model<ContractModel>,
    private readonly boldsignService: BoldsignService,
    private readonly smartpayService: SmartpayService,
    private readonly configService: ConfigService,
  ) {}

  private async _create(data: Partial<ContractModel>) {
    const instance = new this.model(data);
    return instance.save();
  }

  async create(data: SendDocumentToDto) {
    const boldsignResponse = await this.boldsignService.sendDocumentTo(data);

    try {
      await slack.chat.postMessage({
        token: this.configService.getOrThrow("SLACK_API_KEY"),
        channel: SLACK_CHANNELS[FormTypeEnum.contract],
        text: JSON.stringify(data, null, 2),
      });
    } catch (error) {
      console.log("Send slack notification failed", error);
    }

    return this._create({
      documentId: boldsignResponse.documentId,
      amount: parseInt(data.amount),
      details: data,
    });
  }

  findById(id: ID) {
    return this.model.findOne({ _id: id });
  }

  findByDocumentId(docId: string) {
    return this.model.findOne({ documentId: docId });
  }

  findExpiredContracts(date: Date) {
    return this.model.find({
      createdAt: { $lte: date },
      revokedAt: null,
    });
  }

  async revoke(contract: ContractDocument) {
    try {
      await this.boldsignService.revoke(contract.documentId);
      contract.revokedAt = new Date();
      return contract.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findOrCreate(id: string) {
    const data = await this.model.findOne({ documentId: id });
    if (!data)
      return new this.model({ documentId: id, createdAt: new Date() }).save();
    return data;
  }

  sendInvoice(email: string, amount: number) {
    return this.smartpayService.createInvoce(email, amount);
  }

  findWithTenMinutesExpiration() {
    const tenMinsFromNow = new Date(Date.now() - 10 * 60 * 1000);
    return this.model.find({
      createdAt: { $lte: tenMinsFromNow },
      completedAt: null,
      revokedAt: null,
    });
  }
}
