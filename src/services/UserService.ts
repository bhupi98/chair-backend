import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { UpdateProfileDTO } from 'src/dto/UpdateProfileDTO';
import { Roster } from 'src/schemas/Roster';

import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Roster.name) private rosterModel: Model<Roster>,
    
    
  ) {}
  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO) {
    const { name, about, avatarUrl } = updateProfileDTO;

    // Find the user by userId
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user fields
    if (name) user.name = name;
    if (about) user.about = about;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    // Save the updated user document
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
  async addContact(userId: string, contacts: Array<string>): Promise<any> {
    try {
      // Validate input
      if (!userId || !Array.isArray(contacts) || contacts.length === 0) {
        throw new BadRequestException('Invalid input: userId or contacts are missing');
      }
  
      // Filter valid phone numbers
      const validContacts = contacts.filter((contact) => /^\+\d{10,15}$/.test(contact));
      if (validContacts.length === 0) {
        throw new BadRequestException('No valid contacts found');
      }
  
      // Fetch registered users for the provided phone numbers
      const registeredUsers = await this.userModel
        .find({ phoneNumber: { $in: validContacts } })
        .select('_id phoneNumber name avatarUrl about')
        .exec();
  
      const phoneToUserMap = registeredUsers.reduce((map, user) => {
        map[user.phoneNumber] = user._id.toString();
        return map;
      }, {} as Record<string, string>);
  
      // Fetch existing reverse entries for mutual check
      const reverseEntries = await this.rosterModel
        .find({
          userId: { $in: registeredUsers.map((user) => user._id.toString()) },
          contactUserId: userId,
        })
        .select('userId')
        .exec();
  
      const mutualSet = new Set(reverseEntries.map((entry) => entry.userId.toString()));
  
      // Prepare bulk operations
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
  
      // Execute bulk operations
      await this.rosterModel.bulkWrite(bulkOps);
  
      // Format response for registered users
      
      const contactList: any = await this.rosterModel.find({
        userId: userId,
        contactUserId: { $ne: null }
      }).populate({
        path: 'contactUserId',  // Populate the contactUserId field
        model: 'User',          // Specify the User model
        select: '_id name phoneNumber avatarUrl about'  // Select only required fields
      });
      console.log("contactList",contactList)
      return {
        message: 'Contacts updated successfully',
      
        registeredUsers: contactList,
      };
    } catch (error) {
      console.error('Error in addContact:', error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while processing contacts');
    }
  }

}
