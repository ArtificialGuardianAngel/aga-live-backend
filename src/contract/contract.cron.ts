import { Injectable } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { Cron } from "@nestjs/schedule";
import moment from "moment";

@Injectable()
export class ContractCron {
  constructor(private readonly service: ContractService) {}

  @Cron("30 * * * * *")
  async handleCron() {
    console.log("Cron");
    try {
      const now = moment();
      const tenMinsFromNow = now.subtract(10, "minutes");
      console.log(tenMinsFromNow.toDate().toLocaleString());
      const contractsToBeRevoked = await this.service.findExpiredContracts(
        tenMinsFromNow.toDate(),
      );
      // console.log(contractsToBeRevoked);

      for await (const contract of contractsToBeRevoked) {
        console.log(contract);
        await this.service.revoke(contract);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
