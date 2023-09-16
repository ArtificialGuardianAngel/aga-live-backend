import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ContractDocument, ContractModel } from "./entities/contract.entity";
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
    return this.model.findOne({ id });
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
      await axios.post(
        this.configService.get("BOLDSIGN_API_URL"),
        {
          message: "Timeout",
        },
        {
          params: { documentId: contract.documentId },
          headers: {
            Accept: "application/json",
            "X-API-KEY": this.configService.get("BOLDSIGN_API_KEY"),
            "Content-Type":
              "application/json;odata=minimal;odata.streaming=true",
          },
        },
      );
      contract.revokedAt = new Date();
      return await contract.save();
    } catch (error) {
      console.log(error);
    }
  }
}
