import {Module} from "@nestjs/common";
import { ChatGateway } from "src/chat/chat.gateway";







import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import * as config from "config";
;
import {MongooseModule} from "@nestjs/mongoose";

import { JwtStrategy } from "src/jwt.strategy";
import {  User, UserSchema } from "src/schemas/user.schema";
import { AuthService } from "src/services/auth.service";
import { HttpModule } from "@nestjs/axios";

import { Roster, RosterSchema } from "src/schemas/Roster";
import { DeviceValidationService } from "src/services/device-validation.service";



import { OfflineDataModule } from "./OfflineDataModule";
import { Chatlist, ChatlistSchema } from "src/schemas/Chatlist";



const jwtConfig = config.get("jwt");


@Module({
    imports: [
       
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Roster.name, schema: RosterSchema},
            {name: Chatlist.name, schema: ChatlistSchema},
            
        ]),
        PassportModule.register({defaultStrategy: "jwt"}),
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret,
           
        }),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        OfflineDataModule,
        
    ],
  controllers: [],
  providers: [AuthService,ChatGateway,DeviceValidationService,JwtStrategy],


})
export class ChatModule {
}
