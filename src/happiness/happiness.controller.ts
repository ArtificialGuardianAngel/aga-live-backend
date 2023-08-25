import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { HappinessService } from "./happiness.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { User } from "src/auth/guards/auth.decorator";
import { SubmittionDto } from "./dto/create.dto";

@UseGuards(AuthGuard)
@Controller()
export class HappinessController {
  constructor(private readonly service: HappinessService) {}

  @Post("submit")
  handleSubmittion(@User("_id") id: string, @Body() dto: SubmittionDto) {
    return this.service.create(
      id,
      dto.question_answers,
      dto.demographic_answers,
    );
  }
}
