import {
  Body,
  Controller,
  Get,
  Delete,
  HttpCode,
  Param,
  Post,
  ValidationPipe,
  UseGuards,
  Put,
} from '@nestjs/common';
import { LogoutBody } from 'src/dto/LogoutBody';
import { ProfileUpdateDto } from 'src/dto/ProfileUpdateDto';
import { RefreshTokenBody } from 'src/dto/RefreshTokenBody';
import { ResendOtpBody } from 'src/dto/ResendOtpBody';
import { VerifyOtpBody } from 'src/dto/VerifyOtpBody';
import { GetUser } from 'src/get-user.decorator';
import { JwtAuthGuard } from 'src/JwtAuthGuard';
import { AuthService } from 'src/services/auth.service';

@Controller('/api/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. Send OTP
  @Post('/send-otp')
  @HttpCode(200)
  sendOtp(@Body(ValidationPipe) loginBody: ResendOtpBody) {
    return this.authService.sendOtp(loginBody);
  }

  // 2. Verify OTP and Login
  @Post('/verify-otp')
  @HttpCode(200)
  verifyOtp(@Body(ValidationPipe) verifyOtpBody: VerifyOtpBody) {
    return this.authService.verifyOtp(verifyOtpBody);
  }

  @Post('/resend-otp')
  @HttpCode(200)
  resendOtp(@Body(ValidationPipe) resendBody: ResendOtpBody) {
    return this.authService.sendOtp(resendBody);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-user-details')
  @HttpCode(200)
  userDetails(@GetUser() user) {
    return this.authService.getUsersById(user.userId, user?.userType || '');
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile-update')
  async profileUpdate(
    @GetUser() user,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ) {
    return this.authService.updateProfile(user.userId, profileUpdateDto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/profile-update')
  async updateProfile(
    @GetUser() user,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ) {
    return this.authService.updateAndGetUser(user.userId, profileUpdateDto);
  }
  @Put('/user-profile-update')
  async updateUserProfile(
    @GetUser() user,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ) {
    return this.authService.updateUser(user.userId, profileUpdateDto);
  }
  // @UseGuards(JwtAuthGuard)
  @Get('/get-all-repairman')
  @HttpCode(200)
  getUserDetails(@GetUser() user,  @Param('userType') userType: string,) {
    return this.authService.getAllRepairsMen(userType || '');
  }

}
