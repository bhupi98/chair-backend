import { Model } from 'mongoose';
import { Skills } from 'src/schemas/Skills';
export declare class SkillsService {
    private skillsModel;
    constructor(skillsModel: Model<Skills>);
    saveSkills(skills: Array<any>): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, Skills> & Skills & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, Omit<any[], "_id">>[]>;
    getAllSkills(): Promise<any>;
    deleteSkillsById(id: string): Promise<{
        message: string;
    }>;
}
