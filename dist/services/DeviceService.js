"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
let DeviceService = class DeviceService {
    constructor() {
        this.userDevices = new Map();
    }
    async isDeviceRegistered(userId, deviceId) {
        const devices = this.userDevices.get(userId) || new Set();
        return devices.has(deviceId);
    }
    async registerDevice(userId, deviceId) {
        const devices = this.userDevices.get(userId) || new Set();
        devices.add(deviceId);
        this.userDevices.set(userId, devices);
    }
    async validateDevice(userId, deviceId) {
        const devices = this.userDevices.get(userId) || new Set();
        if (!devices.has(deviceId)) {
            return false;
        }
        return true;
    }
    async notifyNewDevice(userId, deviceId) {
        console.log(`Notify user ${userId} of new device ${deviceId}`);
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)()
], DeviceService);
//# sourceMappingURL=DeviceService.js.map