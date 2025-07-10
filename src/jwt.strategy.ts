// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from "config";
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(  @InjectModel(User.name) private userModel: Model<User>,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || config.get("jwt.secret"),
    });
  }

  async validate(payload: any) {
    const { userId, phoneNumber } = payload;
    console.log("payload",payload)
    const user = (await this.userModel.findOne({ _id: userId, phoneNumber }).exec()).toObject();
    if (!user && !user.deviceId) {
      throw new UnauthorizedException('User not found or token is invalid');
    }
    return { userId: userId, phoneNumber:phoneNumber };
  }
}
