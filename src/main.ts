import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RedisIoAdapter } from "src/core/adapters/redis.io.adapter";
import cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const origins = configService.get("ORIGINS").split(",") || [
    "https://aga.live",
    "https://admin.aga.live",
  ];
  console.log(origins);
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  const port = configService.get("PORT") || 3000;
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();

  app.use(cookieParser(null));
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(port);
}
bootstrap();
