import {createParamDecorator} from "@nestjs/common";
import {UserSchema, UserDocument} from "./schemas/user.schema";

export const GetUser = createParamDecorator(async (data, ctx): Promise<UserDocument> => {
    return ctx.switchToHttp().getRequest().user;
});
