import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./adapters/redis.io.adapter";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin:
        process.env.NODE_ENV === "development"
          ? ["http://localhost:5173", "http://127.0.0.1:5173"]
          : ["https://aga.live", "https://admin.aga.live"],
      credentials: true,
    },
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.use(cookieParser(null));
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3000);
}
bootstrap();
