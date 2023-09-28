import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { SendDocumentToDto } from "../api/boldsign/dto/send.doc.dto";
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
  handleBoldsignWebhook(@Body() data: any) {
    console.log(data);
    return "OK";
  }
}
