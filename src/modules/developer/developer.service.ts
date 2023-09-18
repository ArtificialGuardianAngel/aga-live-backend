import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DeveloperModel } from "./entities/developer.entity";
import { Model } from "mongoose";
import { ID } from "src/types";

@Injectable()
export class DeveloperService {
  constructor(
    @InjectModel(DeveloperModel.name)
    private readonly model: Model<DeveloperModel>,
  ) {}

  find() {
    return this.model.find();
  }

  async findById(id: ID) {
    const instance = await this.model.findById(id);
    if (!instance) throw new Error("Instance not found");
    return instance;
  }

  findByNameSlug(slug) {
    return this.model.findOne({ slug });
  }

  create(dto: any) {
    const instance = new this.model(dto);
    return instance.save();
  }

  async update(id: ID, dto: any) {
    const instance = await this.findById(id);
    await instance.updateOne({
      $set: dto,
    });

    return instance;
  }

  delete(id: ID) {
    return this.model.findByIdAndDelete(id);
  }
}
