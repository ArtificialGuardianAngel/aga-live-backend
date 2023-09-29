import { Injectable } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ContractCron {
  constructor(private readonly service: ContractService) {}

  @Cron("0/30 * * * * *")
  async handleCron() {
    // console.log("Cron");
    this.exec();
  }

  async exec() {
    try {
      const contractsToBeRevoked =
        await this.service.findWithTenMinutesExpiration();
      // const response = await func();
      for await (const contract of contractsToBeRevoked) {
        await this.service.revoke(contract);
      }
    } catch (error) {
      console.log(error);
      // if (error instanceof AxiosError)
      //   console.log("Cron exec[request] error", error.message);
      // else if (error instanceof Error) console.log("Cron exec error", error);
    }
  }
}
