import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OfflineData } from 'src/schemas/OfflineData';

@Injectable()
export class OfflineDataService {
  constructor(
    @InjectModel(OfflineData.name) private offlineDataModel: Model<OfflineData>,
  ) {}

  // Add offline data for a user in a single document
  async saveOfflineData(
    offlineUserId: string,
    senderUserId: string,
    offlineData: { type: string; data: any },
  ): Promise<any> {
    if (offlineData.type === 'statusUpdate') {
      return this.offlineDataModel
        .findOneAndUpdate(
          { offlineUserId, type: offlineData.type },
          {
            isSynced: false, // Flag that indicates data is not synced yet
            type: offlineData.type,
            offlineUserId: offlineUserId,
            senderUserId: senderUserId,
            $set: {
              lastSeen: new Date(),
              offlineRecords: offlineData, // Update last seen when saving new data
            },
          },
          { upsert: true }, // Create a new document if one doesn't exist
        )
        .exec();
    }
    if (offlineData.type === 'profileUpdate') {
    }
  }
  async updateLastSeen(offlineUserId: string, lastSeen: string): Promise<void> {
    await this.offlineDataModel
      .updateOne(
        { offlineUserId },
        { $set: { lastSeen: new Date(lastSeen) } }, // Set the lastSeen timestamp
      )
      .exec();
  }

  // Retrieve all offline data for a user
  async getOfflineData(offlineUserId: string): Promise<any[]> {
    const offlineData = await this.offlineDataModel
      .find({ offlineUserId })
      .exec();
    return offlineData ? offlineData : [];
  }

  // Retrieve offline data of a specific type for a user
  async getOfflineDataByType(
    offlineUserId: string,
    type: string,
  ): Promise<any[]> {
    const offlineData = await this.offlineDataModel
      .find({ offlineUserId, type: type })
      .exec();
    return offlineData;
  }

  // Mark all data as synced
  async markDataAsSynced(offlineUserId: string): Promise<void> {
    await this.offlineDataModel
      .updateOne({ offlineUserId }, { isSynced: true })
      .exec();
  }

  // Optionally remove records after syncing
  async deleteSyncedData(offlineUserId: string): Promise<void> {
    await this.offlineDataModel.deleteOne({ offlineUserId }).exec();
  }

  // Delete offline data by type (for example, to clear messages or other data types)
  async deleteOfflineDataByType(
    offlineUserId: string,
    type: string,
  ): Promise<void> {
    await this.offlineDataModel
      .updateOne(
        { offlineUserId },
        { $pull: { offlineRecords: { type } } }, // Remove data of the specified type
      )
      .exec();
  }

  // Retrieve the last seen timestamp for a user


  async saveUpdateUserStatus(offlineUserId: string,type, data: any) {
    return await this.offlineDataModel
      .findOneAndUpdate(
        { offlineUserId, type },
        {
          isSynced: false, // Flag that indicates data is not synced yet
          type:type,
          offlineUserId: offlineUserId,
          senderUserId: data.userId,
       
          offlineRecords: data, // Update last seen when saving new data
        },
        { upsert: true }, // Create a new document if one doesn't exist
      )
      .exec();
  }
  async deleteAllOfflineDataByUserId(userId: string) {
    try {
      const result = await this.offlineDataModel.deleteMany({ offlineUserId: userId });
      console.log(`${result.deletedCount} records deleted for userId: ${userId}`);
    } catch (error) {
      console.error(`Error deleting data for userId ${userId}:`, error);
    }
  }
}
