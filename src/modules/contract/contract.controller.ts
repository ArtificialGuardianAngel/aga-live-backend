import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { SendDocumentToDto } from "../api/boldsign/dto/send.doc.dto";
import { BoldsignWebhookDTO } from "./dto/boldsign.webhook.dto";
@Controller()
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @Get(":id")
  handleGetById(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post("create")
  handleCreate(@Body() data: SendDocumentToDto) {
    return this.service.create(data);
  }

  @Post("boldsign")
  @HttpCode(200)
  async handleBoldsignWebhook(@Body() data: BoldsignWebhookDTO) {
    console.log(data);
    try {
      const contractInstnace = await this.service.findOrCreate(
        data.document.documentId,
      );
      if (data.event.eventType === "Sent") return "OK";
      if (data.event.eventType === "Completed") {
        contractInstnace.completedAt = new Date();
        await contractInstnace.save();
        return "OK";
      }
      return "OK";
    } catch (error) {
      console.error(error);
    } finally {
      return "OK";
    }
  }
}
