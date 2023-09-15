import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ContractService } from "./contract.service";
@Controller()
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @Get(":id")
  handleGetById(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Post("create")
  handleCreate(@Body("documentId") id: string) {
    return this.service.create(id);
  }
}
