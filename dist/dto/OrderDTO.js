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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResponseDTO = exports.UpdateOrderDTO = exports.OrderDTO = exports.TitleDescription = exports.UpdateBidDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateBidDTO {
}
exports.UpdateBidDTO = UpdateBidDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Amount is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a number' }),
    (0, class_validator_1.Min)(1, { message: 'Amount must be greater than 0' }),
    __metadata("design:type", Number)
], UpdateBidDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Time estimate is required' }),
    (0, class_validator_1.IsString)({ message: 'Time estimate must be a string' }),
    __metadata("design:type", String)
], UpdateBidDTO.prototype, "timeEstimate", void 0);
class TitleDescription {
}
exports.TitleDescription = TitleDescription;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TitleDescription.prototype, "text", void 0);
class Coordinates {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Coordinates.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], Coordinates.prototype, "lon", void 0);
class Location {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Location.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Coordinates),
    __metadata("design:type", Coordinates)
], Location.prototype, "coords", void 0);
class BidDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BidDTO.prototype, "repairmanId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BidDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BidDTO.prototype, "timeEstimate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BidDTO.prototype, "bidAt", void 0);
class OrderDTO {
    constructor() {
        this.postedAt = new Date().toISOString();
    }
}
exports.OrderDTO = OrderDTO;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TitleDescription),
    __metadata("design:type", TitleDescription)
], OrderDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TitleDescription),
    __metadata("design:type", TitleDescription)
], OrderDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => Location),
    __metadata("design:type", Location)
], OrderDTO.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OrderDTO.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDTO.prototype, "postedAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDTO.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderDTO.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], OrderDTO.prototype, "allowBidding", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], OrderDTO.prototype, "isEnable", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], OrderDTO.prototype, "images", void 0);
class UpdateOrderDTO {
}
exports.UpdateOrderDTO = UpdateOrderDTO;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => TitleDescription),
    __metadata("design:type", TitleDescription)
], UpdateOrderDTO.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => TitleDescription),
    __metadata("design:type", TitleDescription)
], UpdateOrderDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Location),
    __metadata("design:type", Location)
], UpdateOrderDTO.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateOrderDTO.prototype, "budget", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateOrderDTO.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDTO.prototype, "acceptedBidRepairmanId", void 0);
class OrderResponseDTO {
}
exports.OrderResponseDTO = OrderResponseDTO;
//# sourceMappingURL=OrderDTO.js.map