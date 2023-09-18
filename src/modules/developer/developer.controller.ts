import { Controller, Get, Param } from "@nestjs/common";
import { DeveloperService } from "./developer.service";

@Controller("")
export class DeveloperController {
  constructor(private readonly service: DeveloperService) {}

  @Get(":slug")
  handleGetBySlug(@Param("slug") slug: string) {
    return this.service.findByNameSlug(slug);
  }
}
