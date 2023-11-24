import { NestFactory } from "@nestjs/core";
import { ActivityModule } from "./service/module";

async function bootstrap() {
  const app = await NestFactory.create(ActivityModule);
  await app.listen(8000);
}
bootstrap();
