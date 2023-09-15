import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { DeveloperService } from "./developer.service";
import { ID } from "src/types";

@Controller("developer")
export class DeveloperController {
  constructor(private readonly service: DeveloperService) {}

  @Get("list")
  handleGetList() {
    return this.service.find();
  }

  @Get(":slug")
  handleGetBySlug(@Param("slug") slug: string) {
    return this.service.findByNameSlug(slug);
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
