"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth.module");
const chat_module_1 = require("./modules/chat.module");
const core_2 = require("@nestjs/core");
const GlobalExceptionFilter_1 = require("./GlobalExceptionFilter");
const OfflineDataModule_1 = require("./modules/OfflineDataModule");
const schedule_1 = require("@nestjs/schedule");
const Order_module_1 = require("./modules/Order.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async () => ({
                    uri: process.env.MONGO_URL,
                    connectionFactory: (connection) => {
                        console.log('MongoDB Connected');
                        return connection;
                    },
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60,
                    limit: 10,
                }]),
            schedule_1.ScheduleModule.forRoot(),
            axios_1.HttpModule,
            auth_module_1.AuthModule,
            OfflineDataModule_1.OfflineDataModule,
            chat_module_1.ChatModule,
            Order_module_1.OrderModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [{
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            }, app_service_1.AppService, {
                provide: core_2.APP_FILTER,
                useClass: GlobalExceptionFilter_1.GlobalExceptionFilter,
            }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map