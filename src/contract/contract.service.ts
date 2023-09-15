import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ContractModel } from "./entities/contract.entity";
import { Model } from "mongoose";
import { ID } from "src/types";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(ContractModel.name)
    private readonly model: Model<ContractModel>,
    private readonly configService: ConfigService,
  ) {}

  create(documentId: string) {
    const instance = new this.model({ documentId });
    return instance.save();
  }

  findById(id: ID) {
    return this.model.findOne({ id, revokedAt: { $exists: false } });
  }

  findByDocumentId(docId: string) {
    return this.model.findOne({ documentId: docId });
  }

  findExpiredContracts(date: Date) {
    return this.model.find({ createdAt: { $lte: date } });
  }

  async revoke(id: ID) {
    try {
      const contract = await this.findById(id);
      await axios.post(
        this.configService.get("BOLDSIGN_API_URL"),
        {
          message: "",
        },
        { params: { documentId: contract.documentId } },
      );
      contract.revokedAt = new Date();
      return await contract.save();
    } catch (error) {}
  }
}
