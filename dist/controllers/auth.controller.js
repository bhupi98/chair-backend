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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const ProfileUpdateDto_1 = require("../dto/ProfileUpdateDto");
const ResendOtpBody_1 = require("../dto/ResendOtpBody");
const VerifyOtpBody_1 = require("../dto/VerifyOtpBody");
const get_user_decorator_1 = require("../get-user.decorator");
const JwtAuthGuard_1 = require("../JwtAuthGuard");
const auth_service_1 = require("../services/auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    sendOtp(loginBody) {
        return this.authService.sendOtp(loginBody);
    }
    verifyOtp(verifyOtpBody) {
        return this.authService.verifyOtp(verifyOtpBody);
    }
    resendOtp(resendBody) {
        return this.authService.sendOtp(resendBody);
    }
    userDetails(user) {
        return this.authService.getUsersById(user.userId, user?.userType || '');
    }
    async profileUpdate(user, profileUpdateDto) {
        return this.authService.updateProfile(user.userId, profileUpdateDto);
    }
    async updateProfile(user, profileUpdateDto) {
        return this.authService.updateAndGetUser(user.userId, profileUpdateDto);
    }
    async updateUserProfile(user, profileUpdateDto) {
        return this.authService.updateUser(user.userId, profileUpdateDto);
    }
    getUserDetails(user, userType) {
        return this.authService.getAllRepairsMen(userType || '');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/send-otp'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResendOtpBody_1.ResendOtpBody]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('/verify-otp'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyOtpBody_1.VerifyOtpBody]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('/resend-otp'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResendOtpBody_1.ResendOtpBody]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.Get)('/get-user-details'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "userDetails", null);
__decorate([
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.Post)('/profile-update'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProfileUpdateDto_1.ProfileUpdateDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "profileUpdate", null);
__decorate([
    (0, common_1.UseGuards)(JwtAuthGuard_1.JwtAuthGuard),
    (0, common_1.Put)('/profile-update'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProfileUpdateDto_1.ProfileUpdateDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('/user-profile-update'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ProfileUpdateDto_1.ProfileUpdateDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Get)('/get-all-repairman'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('userType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getUserDetails", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('/api/users'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map