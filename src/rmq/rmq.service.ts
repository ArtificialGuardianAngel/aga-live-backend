import { Inject, Injectable } from "@nestjs/common";
import { IRmqOptions, ISendData } from "./rmq.interfaces";
import { connect, Connection, Channel, Replies, ConsumeMessage } from "amqplib";
import { RMQ_OPTIONS } from "./rmq.constants";

@Injectable()
export class RmqService {
  private connection: Connection;
  private channel: Channel;
  private options: IRmqOptions;
  private result: Replies.AssertQueue;

  constructor(@Inject(RMQ_OPTIONS) options: IRmqOptions) {
    this.options = options;
    this.connect().then(() => console.log("RabbitMQ Service: Connected"));
  }

  private async connect() {
    this.connection = await connect(this.options.url);
    this.channel = await this.connection.createChannel();
    this.result = await this.channel.assertQueue("reply_prompt");
  }

  public send(
    uid: string,
    data: ISendData,
    cb?: (data: {
      sid: string;
      message: string;
      history: Record<string, Array<string>>;
    }) => void,
  ) {
    const sendData = Buffer.from(JSON.stringify(data));

    this.channel.sendToQueue("prompt", sendData, {
      replyTo: this.result.queue,
      correlationId: uid,
    });

    this.subscribe((data) => {
      try {
        console.log("[", Buffer.from(data.content).toString(), "]");
        const response = JSON.parse(Buffer.from(data.content).toString());
        cb(response);
      } finally {
        this.channel.ack(data);
      }
    });
  }
  public subscribe(callback: (data: ConsumeMessage) => void) {
    try {
      this.channel.consume(this.result.queue, callback);
    } catch (e) {
      console.warn(e);
    }
  }
}
