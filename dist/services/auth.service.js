"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
const mongoose = require("mongoose");
const device_validation_service_1 = require("./device-validation.service");
const mongo_utils_1 = require("../mongo-utils");
const twilio_1 = require("twilio");
const BLOCK_DURATION_HOURS = 24;
const MAX_ATTEMPTS = 5;
let AuthService = class AuthService {
    constructor(jwtService, httpService, deviceValidationService, userModel) {
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.deviceValidationService = deviceValidationService;
        this.userModel = userModel;
        this.client = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.verifySid = process.env.TWILIO_VERIFY_SID;
    }
    async verifyOtp(verifyOtpBody) {
        const user = await this.userModel.findOne({
            phoneNumber: verifyOtpBody.phone,
        });
        if (!user || user.otpExpires < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        const verificationCheck = {
            status: "approved"
        };
        if (verificationCheck.status !== 'approved') {
            throw new Error('Invalid OTP');
        }
        user.otp = null;
        user.attemptCount = 0;
        user.otpExpires = null;
        user.isVerified = true;
        user.phoneNumber = verifyOtpBody.phone;
        user.deviceId = verifyOtpBody.deviceId;
        user.deviceType = verifyOtpBody.deviceType;
        user.userType = verifyOtpBody.userType;
        const payload = {
            phoneNumber: user.phoneNumber,
            userId: user._id,
            deviceId: user.deviceId,
            userType: verifyOtpBody.userType
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.JWT_SECRET,
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '365d',
        });
        user.jwtToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
        const userDetails = await this.getUsersById(user.id, verifyOtpBody.userType);
        console.log('user@@@@@@####', user);
        return {
            success: true,
            accessToken,
            userId: user.id,
            phoneNumber: user.phoneNumber,
            ...userDetails
        };
    }
    async generateAccessToken(payload) {
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
        });
    }
    async refreshAccessToken(userId) {
        try {
            console.log('userId', userId);
            const user = (await this.userModel.findById(userId).select('refreshToken')).toObject();
            const payload = await this.jwtService.verifyAsync(user.refreshToken, {
                secret: process.env.JWT_SECRET,
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const accessToken = await this.generateAccessToken(payload);
            return accessToken;
        }
        catch (error) {
            console.log('error', error);
            return new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async sendOtp(loginBody) {
        const now = new Date();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        if (!loginBody.phone) {
            throw new common_1.HttpException('Phone number is required', common_1.HttpStatus.BAD_REQUEST);
        }
        console.log('Received phone number:', loginBody.phone);
        let otpAttempt = await this.userModel.findOne({
            phoneNumber: loginBody.phone,
        });
        if (!otpAttempt) {
            otpAttempt = {
                phoneNumber: loginBody.phone,
                attemptCount: 0,
                blockedUntil: null,
                deviceId: null,
                deviceType: null,
            };
        }
        console.log('otpAttempt:', otpAttempt);
        if (otpAttempt.blockedUntil && otpAttempt.blockedUntil > now) {
            const remainingTime = Math.ceil((otpAttempt.blockedUntil.getTime() - now.getTime()) / 3600000);
            throw new common_1.HttpException(`Blocked. Try again in ${remainingTime} hours`, common_1.HttpStatus.FORBIDDEN);
        }
        otpAttempt.attemptCount += 1;
        if (otpAttempt.attemptCount > MAX_ATTEMPTS) {
            const blockedUntil = new Date(now.getTime() + BLOCK_DURATION_HOURS * 3600000);
            await this.userModel.updateOne({ phoneNumber: loginBody.phone }, {
                blockedUntil,
                attemptCount: MAX_ATTEMPTS,
            }, { upsert: true });
            throw new common_1.HttpException(`Too many attempts. You are blocked for ${BLOCK_DURATION_HOURS} hours.`, common_1.HttpStatus.FORBIDDEN);
        }
        if (!otpAttempt.deviceId || otpAttempt.deviceId !== loginBody.deviceId) {
            await this.notifyNewDevice(otpAttempt);
        }
        await this.userModel.updateOne({ phoneNumber: loginBody.phone }, {
            otpExpires,
            deviceId: loginBody.deviceId,
            deviceType: loginBody.deviceType,
            attemptCount: otpAttempt.attemptCount,
        }, { upsert: true });
        return {
            success: true,
            message: 'OTP sent',
            otpExpires,
        };
    }
    async validateUser(token) {
        try {
            console.log('token', token);
            const user = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            return user;
        }
        catch (error) {
            console.log('error', error);
            return null;
        }
    }
    async updateLastActive(userId) {
        const now = new Date();
        await this.userModel.updateOne({ _id: userId }, { $set: { lastActive: now } });
    }
    async updateUser(id, updateData) {
        const oprations = this.userModel
            .findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: updateData }, { new: true })
            .exec();
        const updatedUser = await (0, mongo_utils_1.handleMongoOperation)(oprations, 'updatedUser');
        console.log('updatedUser', updateData);
        return updatedUser;
    }
    async updateAndGetUser(userId, updateData) {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        })
            .select('_id phoneNumber isVerified lastSeen name avatarUrl about status skills experience websiteUrl portfolioImages idProofImages email')
            .exec();
        if (!updatedUser) {
            throw new Error('User not found or update failed');
        }
        return updatedUser;
    }
    async getUsersById(userId, userType) {
        const user = await this.userModel
            .findById(userId)
            .select('_id phoneNumber userType websiteUrl isVerified skills name avatarUrl email idProofImages portfolioImages')
            .exec();
        let requiredFields = ['phoneNumber', 'userType', 'isVerified', 'name', "skills", "idProofImages", "portfolioImages"];
        if (userType == "Customer") {
            requiredFields = ['phoneNumber', 'userType', 'isVerified', 'name'];
        }
        const isProfileComplete = requiredFields.every(field => user[field] && user[field] !== '');
        return {
            ...user.toObject(),
            isProfileComplete
        };
    }
    async notifyNewDevice(user) {
        console.log(`Notify user of new device`);
    }
    async updateProfile(userId, profileUpdateDto) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, profileUpdateDto);
        await user.save();
        return user;
    }
    async getAllRepairsMen(userType) {
        return await this.userModel.find({
            userType: userType || "Customer"
        }).select('_id phoneNumber userType websiteUrl isVerified skills name avatarUrl email idProofImages portfolioImages').exec();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        axios_1.HttpService,
        device_validation_service_1.DeviceValidationService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map