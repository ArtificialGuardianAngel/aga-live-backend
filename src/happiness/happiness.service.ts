import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HappinessResult } from "src/entities/result";
import { ID } from "src/types";

@Injectable()
export class HappinessService {
  constructor(
    @InjectModel(HappinessResult.name)
    private readonly model: Model<HappinessResult>,
  ) {}

  create(
    userId: ID,
    question_answers: Record<string, Record<string, string>>,
    demographic_answers: Record<string, string>,
  ) {
    const instance = new this.model({
      researched: userId,
      question_answers,
      demographic_answers,
    });
    return instance.save();
  }
}
