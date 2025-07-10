import { Injectable, BadRequestException } from '@nestjs/common';

export enum DeviceIdType {
  ANDROID = 'ANDROID', // Covers both ANDROID_ID and AAID
  IOS = 'IOS',         // Covers both IDFA and IDFV
}

// Regex Patterns for Android and iOS Device IDs
const DEVICE_ID_PATTERNS = {
  [DeviceIdType.ANDROID]: [
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, // Android Advertising ID (AAID)
    /^[0-9a-f]{16}$/i,                                                // ANDROID_ID
  ],
  [DeviceIdType.IOS]: [
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, // iOS IDFA/IDFV
  ],
};

@Injectable()
export class DeviceValidationService {
  validateDeviceId(deviceId: string, deviceType: DeviceIdType): boolean {
    if (!deviceId || !deviceType) {
      throw new BadRequestException('Device ID and type are required.');
    }

    // Get patterns for the device type
    const patterns = DEVICE_ID_PATTERNS[deviceType];
    if (!patterns) {
      throw new BadRequestException(`Unsupported device type: ${deviceType}`);
    }

    // Validate the ID against all patterns for the device type
    const isValidFormat = patterns.some((pattern) => pattern.test(deviceId));
    const isNotPlaceholder = deviceId !== '00000000-0000-0000-0000-000000000000';

    return isValidFormat && isNotPlaceholder;
  }
}
