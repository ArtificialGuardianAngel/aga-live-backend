import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserEntity, UserEntityDocumnet } from "../entities/user.entity";
import { Model } from "mongoose";
import { PromptEntity } from "../entities/prompt.entity";
import { RmqService } from "src/rmq/rmq.service";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    @InjectModel(PromptEntity.name)
    private readonly model: Model<PromptEntity>,
  ) {}

  handlePrompt(user: UserEntityDocumnet, prompt: string) {
    const promptInstance = new this.model({ input: prompt, creator: user._id });
    // handle mining
    // handle prompt via rmq <propmpt._id user._id prompt.input> => <prompt.output propmpt._id user._id>
    return promptInstance.save();
  }
}
