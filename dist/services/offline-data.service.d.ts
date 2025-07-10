import { Model } from 'mongoose';
import { OfflineData } from 'src/schemas/OfflineData';
export declare class OfflineDataService {
    private offlineDataModel;
    constructor(offlineDataModel: Model<OfflineData>);
    saveOfflineData(offlineUserId: string, senderUserId: string, offlineData: {
        type: string;
        data: any;
    }): Promise<any>;
    updateLastSeen(offlineUserId: string, lastSeen: string): Promise<void>;
    getOfflineData(offlineUserId: string): Promise<any[]>;
    getOfflineDataByType(offlineUserId: string, type: string): Promise<any[]>;
    markDataAsSynced(offlineUserId: string): Promise<void>;
    deleteSyncedData(offlineUserId: string): Promise<void>;
    deleteOfflineDataByType(offlineUserId: string, type: string): Promise<void>;
    saveUpdateUserStatus(offlineUserId: string, type: any, data: any): Promise<import("mongoose").Document<unknown, {}, OfflineData> & OfflineData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteAllOfflineDataByUserId(userId: string): Promise<void>;
}
