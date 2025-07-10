"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceValidationService = exports.DeviceIdType = void 0;
const common_1 = require("@nestjs/common");
var DeviceIdType;
(function (DeviceIdType) {
    DeviceIdType["ANDROID"] = "ANDROID";
    DeviceIdType["IOS"] = "IOS";
})(DeviceIdType || (exports.DeviceIdType = DeviceIdType = {}));
const DEVICE_ID_PATTERNS = {
    [DeviceIdType.ANDROID]: [
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        /^[0-9a-f]{16}$/i,
    ],
    [DeviceIdType.IOS]: [
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    ],
};
let DeviceValidationService = class DeviceValidationService {
    validateDeviceId(deviceId, deviceType) {
        if (!deviceId || !deviceType) {
            throw new common_1.BadRequestException('Device ID and type are required.');
        }
        const patterns = DEVICE_ID_PATTERNS[deviceType];
        if (!patterns) {
            throw new common_1.BadRequestException(`Unsupported device type: ${deviceType}`);
        }
        const isValidFormat = patterns.some((pattern) => pattern.test(deviceId));
        const isNotPlaceholder = deviceId !== '00000000-0000-0000-0000-000000000000';
        return isValidFormat && isNotPlaceholder;
    }
};
exports.DeviceValidationService = DeviceValidationService;
exports.DeviceValidationService = DeviceValidationService = __decorate([
    (0, common_1.Injectable)()
], DeviceValidationService);
//# sourceMappingURL=device-validation.service.js.map