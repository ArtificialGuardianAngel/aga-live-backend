import { Injectable } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { Cron } from "@nestjs/schedule";
import moment from "moment";

@Injectable()
export class ContractCron {
  constructor(private readonly service: ContractService) {}

  @Cron("30 * * * * *")
  async handleCron() {
    try {
      const now = moment();
      const tenMinsFromNow = now.subtract(10, "minutes");

      const contractsToBeRevoked = this.service.findExpiredContracts(
        tenMinsFromNow.toDate(),
      );

      for await (const contract of contractsToBeRevoked) {
        await this.service.revoke(contract.documentId);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
