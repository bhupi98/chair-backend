export declare class DeviceService {
    private userDevices;
    isDeviceRegistered(userId: string, deviceId: string): Promise<boolean>;
    registerDevice(userId: string, deviceId: string): Promise<void>;
    validateDevice(userId: string, deviceId: string): Promise<boolean>;
    notifyNewDevice(userId: string, deviceId: string): Promise<void>;
}
