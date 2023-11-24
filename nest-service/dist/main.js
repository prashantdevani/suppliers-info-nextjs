"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const module_1 = require("./service/module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(module_1.ActivityModule);
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map