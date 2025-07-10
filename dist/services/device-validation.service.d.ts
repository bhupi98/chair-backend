export declare enum DeviceIdType {
    ANDROID = "ANDROID",
    IOS = "IOS"
}
export declare class DeviceValidationService {
    validateDeviceId(deviceId: string, deviceType: DeviceIdType): boolean;
}
