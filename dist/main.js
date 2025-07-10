"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const GlobalExceptionFilter_1 = require("./GlobalExceptionFilter");
const compression = require("compression");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors();
    app.useGlobalFilters(new GlobalExceptionFilter_1.GlobalExceptionFilter());
    app.use(compression());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map