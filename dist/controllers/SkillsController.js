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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const SkillsService_1 = require("../services/SkillsService");
let SkillsController = class SkillsController {
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    async getAllUsers() {
        return this.skillsService.getAllSkills();
    }
    async bulkInsert(skills) {
        console.log("skills", skills);
        return this.skillsService.saveSkills(skills);
    }
    async deleteUser(id) {
        return this.skillsService.deleteSkillsById(id);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('skills-insert'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "bulkInsert", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "deleteUser", null);
exports.SkillsController = SkillsController = __decorate([
    (0, common_1.Controller)('api/skills'),
    __metadata("design:paramtypes", [SkillsService_1.SkillsService])
], SkillsController);
//# sourceMappingURL=SkillsController.js.map