import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { DeveloperService } from "src/modules/developer/developer.service";
import { Filter } from "../dto/user.dto";
import { ID } from "src/types";

@Controller("developer")
export class AdminDeveloperController {
  constructor(private readonly service: DeveloperService) {}

  @Get("list")
  handleGetList(@Body() filter: Filter) {
    return this.service.find(filter);
  }

  @Post("create")
  handleCreate(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Put(":id")
  handleUpdateById(@Param("id") id: ID, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  handleDeleteById(@Param("id") id: ID) {
    return this.service.delete(id);
  }
}
