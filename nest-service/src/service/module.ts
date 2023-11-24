import { Module, NestModule } from "@nestjs/common";
import { ActivityController } from "./controller";
@Module({
  imports: [],
  providers: [],
  controllers: [ActivityController],
})
export class ActivityModule implements NestModule {
  configure() {}
}
