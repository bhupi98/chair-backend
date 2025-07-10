import { Model } from 'mongoose';
import { UpdateProfileDTO } from 'src/dto/UpdateProfileDTO';
import { Roster } from 'src/schemas/Roster';
import { User } from 'src/schemas/user.schema';
export declare class UserService {
    private userModel;
    private rosterModel;
    constructor(userModel: Model<User>, rosterModel: Model<Roster>);
    updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO): Promise<{
        message: string;
        user: {
            userId: import("mongoose").Types.ObjectId;
            name: string;
            about: string;
            avatarUrl: string;
        };
    }>;
    addContact(userId: string, contacts: Array<string>): Promise<any>;
}
