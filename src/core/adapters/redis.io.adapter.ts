import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { UserDocumnet } from "src/core/entities/user.entity";
import { environment } from "src/core/enviroment";
import { verify } from "jsonwebtoken";
import { INestApplicationContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface CustomSocket extends Socket {
  user: UserDocumnet;
}

export class RedisIoAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this.configService.getOrThrow("REDIS_URL"),
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    port = this.configService.get<number>("SOCKET_PORT") || port;
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    server.use((socket: CustomSocket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        verify(
          socket.handshake.query.token as string,
          environment.JWT_SECRET_PASSWORD,
          (err, decoded) => {
            if (err) {
              console.log(err);
              next(new Error("Authentication error"));
            } else {
              socket.user = decoded as UserDocumnet;
              next();
            }
          },
        );
      } else {
        next(new Error("Authentication error"));
      }
    });
    return server;
  }
}
