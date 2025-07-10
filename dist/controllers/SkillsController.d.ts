import { SkillsService } from 'src/services/SkillsService';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    getAllUsers(): Promise<any>;
    bulkInsert(skills: []): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("../schemas/Skills").Skills> & import("../schemas/Skills").Skills & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, Omit<any[], "_id">>[]>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
