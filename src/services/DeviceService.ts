import { Injectable } from "@nestjs/common";

@Injectable()
export class DeviceService {
  private userDevices = new Map<string, Set<string>>();

  async isDeviceRegistered(userId: string, deviceId: string): Promise<boolean> {
    const devices = this.userDevices.get(userId) || new Set();
    return devices.has(deviceId);
  }

  async registerDevice(userId: string, deviceId: string): Promise<void> {
    const devices = this.userDevices.get(userId) || new Set();
    devices.add(deviceId);
    this.userDevices.set(userId, devices);
  }

  async validateDevice(userId: string, deviceId: string): Promise<boolean> {
    const devices = this.userDevices.get(userId) || new Set();

    // Validate if the device is registered
    if (!devices.has(deviceId)) {
      return false;
    }

    // Optionally, validate additional metadata or fingerprint here
    return true;
  }

  async notifyNewDevice(userId: string, deviceId: string): Promise<void> {
    // Send notification logic (e.g., email, SMS)
    console.log(`Notify user ${userId} of new device ${deviceId}`);
  }
}