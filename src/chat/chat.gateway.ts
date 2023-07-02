import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { ChatService } from "./chat.service";
import { UserEntity, UserEntityDocumnet } from "src/entities/user.entity";
import { CustomSocket } from "src/adapters/redis.io.adapter";
import { RmqService } from "src/rmq/rmq.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly service: ChatService,
    private readonly rmq: RmqService,
  ) {}

  @SubscribeMessage("prompt")
  async handlePrompt(client: CustomSocket, data: { message: string }) {
    console.log(data);
    const prompt = await this.service.handlePrompt(client.user, data.message);
    //
    // add coinst to balance
    console.log(prompt);
    client.emit("prompt_added", prompt);
    this.rmq.send(
      prompt._id.toString(),
      {
        sid: prompt._id.toString(),
        prompt: data.message,
      },
      (data) => {
        if (data.sid === prompt._id.toString()) {
          console.log(">>>>>>>", data);
          client.emit("prompt_reply", data);
        }
      },
    );
    console.log(data);
  }
}
