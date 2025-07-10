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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Roster_1 = require("../schemas/Roster");
const user_schema_1 = require("../schemas/user.schema");
let UserService = class UserService {
    constructor(userModel, rosterModel) {
        this.userModel = userModel;
        this.rosterModel = rosterModel;
    }
    async updateProfile(userId, updateProfileDTO) {
        const { name, about, avatarUrl } = updateProfileDTO;
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (name)
            user.name = name;
        if (about)
            user.about = about;
        if (avatarUrl)
            user.avatarUrl = avatarUrl;
        await user.save();
        return {
            message: 'Profile updated successfully',
            user: {
                userId: user._id,
                name: user.name,
                about: user.about,
                avatarUrl: user.avatarUrl,
            },
        };
    }
    async addContact(userId, contacts) {
        try {
            if (!userId || !Array.isArray(contacts) || contacts.length === 0) {
                throw new common_1.BadRequestException('Invalid input: userId or contacts are missing');
            }
            const validContacts = contacts.filter((contact) => /^\+\d{10,15}$/.test(contact));
            if (validContacts.length === 0) {
                throw new common_1.BadRequestException('No valid contacts found');
            }
            const registeredUsers = await this.userModel
                .find({ phoneNumber: { $in: validContacts } })
                .select('_id phoneNumber name avatarUrl about')
                .exec();
            const phoneToUserMap = registeredUsers.reduce((map, user) => {
                map[user.phoneNumber] = user._id.toString();
                return map;
            }, {});
            const reverseEntries = await this.rosterModel
                .find({
                userId: { $in: registeredUsers.map((user) => user._id.toString()) },
                contactUserId: userId,
            })
                .select('userId')
                .exec();
            const mutualSet = new Set(reverseEntries.map((entry) => entry.userId.toString()));
            const bulkOps = validContacts.map((contactNumber) => {
                const registeredUserId = phoneToUserMap[contactNumber] || null;
                return {
                    updateOne: {
                        filter: { userId, contactNumber },
                        update: {
                            $set: {
                                contactNumber,
                                contactUserId: registeredUserId,
                                isRegistered: !!registeredUserId,
                                isMutual: registeredUserId ? mutualSet.has(registeredUserId) : false,
                            },
                        },
                        upsert: true,
                    },
                };
            });
            await this.rosterModel.bulkWrite(bulkOps);
            const contactList = await this.rosterModel.find({
                userId: userId,
                contactUserId: { $ne: null }
            }).populate({
                path: 'contactUserId',
                model: 'User',
                select: '_id name phoneNumber avatarUrl about'
            });
            console.log("contactList", contactList);
            return {
                message: 'Contacts updated successfully',
                registeredUsers: contactList,
            };
        }
        catch (error) {
            console.error('Error in addContact:', error.message);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('An error occurred while processing contacts');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(Roster_1.Roster.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=UserService.js.map