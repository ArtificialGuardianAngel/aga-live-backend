import { Injectable } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { Cron } from "@nestjs/schedule";
import moment from "moment";
import { BoldsignService } from "../api/boldsign/boldsign.service";
import { AxiosError } from "axios";

@Injectable()
export class ContractCron {
  constructor(
    private readonly service: ContractService,
    private readonly boldsignService: BoldsignService,
  ) {}

  @Cron("0/30 * * * * *")
  async handleCron() {
    // console.log("Cron");
    this.exec();
  }

  async exec(func = this.boldsignService.getDocuments) {
    try {
      const response = await func();
      console.log("Currently syncing ", response.data.result.length);
      if (response.data.result.length === 0) return;
      await this.service.sync(response.data.result);

      // if (response.data.result.length < response.data.pageDetails.pageSize) return;
      return this.exec(response.next);
    } catch (error) {
      console.log(error);
      // if (error instanceof AxiosError)
      //   console.log("Cron exec[request] error", error.message);
      // else if (error instanceof Error) console.log("Cron exec error", error);
    }
  }
}
