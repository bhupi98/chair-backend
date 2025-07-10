"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("../chat/chat.gateway");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
;
const mongoose_1 = require("@nestjs/mongoose");
const jwt_strategy_1 = require("../jwt.strategy");
const user_schema_1 = require("../schemas/user.schema");
const auth_service_1 = require("../services/auth.service");
const axios_1 = require("@nestjs/axios");
const Roster_1 = require("../schemas/Roster");
const device_validation_service_1 = require("../services/device-validation.service");
const OfflineDataModule_1 = require("./OfflineDataModule");
const Chatlist_1 = require("../schemas/Chatlist");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: Roster_1.Roster.name, schema: Roster_1.RosterSchema },
                { name: Chatlist_1.Chatlist.name, schema: Chatlist_1.ChatlistSchema },
            ]),
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET
            }),
            axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            }),
            OfflineDataModule_1.OfflineDataModule,
        ],
        controllers: [],
        providers: [auth_service_1.AuthService, chat_gateway_1.ChatGateway, device_validation_service_1.DeviceValidationService, jwt_strategy_1.JwtStrategy],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map