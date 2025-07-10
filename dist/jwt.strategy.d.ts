import { Strategy } from 'passport-jwt';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(userModel: Model<User>);
    validate(payload: any): Promise<{
        userId: any;
        phoneNumber: any;
    }>;
}
export {};
