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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Skills_1 = require("../schemas/Skills");
let SkillsService = class SkillsService {
    constructor(skillsModel) {
        this.skillsModel = skillsModel;
    }
    async saveSkills(skills) {
        try {
            const res = await this.skillsModel.insertMany(skills, { ordered: false });
            console.log("res", res);
            return res;
        }
        catch (error) {
            console.error('Bulk insert error:', error);
            throw new Error('Bulk insert failed');
        }
    }
    async getAllSkills() {
        return this.skillsModel.find().exec();
    }
    async deleteSkillsById(id) {
        const result = await this.skillsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`skill with ID ${id} not found`);
        }
        return { message: 'skills deleted successfully' };
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Skills_1.Skills.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SkillsService);
//# sourceMappingURL=SkillsService.js.map