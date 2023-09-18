import { Controller, Post, Param, Body } from "@nestjs/common";
import { FormService } from "./form.service";
import { FormTypeEnum } from "./form.constants";

@Controller()
export class FormController {
  constructor(private service: FormService) {}

  @Post("apply/:type")
  handleApply(@Body() data: any, @Param("type") type: FormTypeEnum) {
    console.log(type);
    return this.service.apply(type, data);
  }
}
