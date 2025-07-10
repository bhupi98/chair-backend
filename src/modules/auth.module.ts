import { Module} from "@nestjs/common";



import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import * as config from "config";
;
import {MongooseModule} from "@nestjs/mongoose";
import { AuthController } from "src/controllers/auth.controller";
import { JwtStrategy } from "src/jwt.strategy";
import {  User, UserSchema } from "src/schemas/user.schema";
import { AuthService } from "src/services/auth.service";
import { HttpModule } from "@nestjs/axios";
import { DeviceValidationService } from "src/services/device-validation.service";
import { Roster, RosterSchema } from "src/schemas/Roster";
import { SkillsController } from "src/controllers/SkillsController";
import { SkillsService } from "src/services/SkillsService";
import { Skills, SkillsSchema } from "src/schemas/Skills";
import { UploadController } from "src/controllers/upload.controller";
import { UploadService } from "src/services/UploadService";



const jwtConfig = config.get("jwt");


@Module({

    imports: [
       
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Roster.name, schema: RosterSchema},
            {name: Skills.name, schema: SkillsSchema},
            
            
        ]),
        PassportModule.register({defaultStrategy: "jwt"}),
        JwtModule.register({
            secret: process.env.JWT_SECRET || jwtConfig.secret,
           
        }),
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    
    ],
    controllers: [AuthController,SkillsController,UploadController],
    providers: [AuthService,DeviceValidationService,SkillsService,UploadService,JwtStrategy],
    exports: [JwtModule]
})
export class AuthModule {
}
