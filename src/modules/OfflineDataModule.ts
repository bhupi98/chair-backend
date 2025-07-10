import { Module} from "@nestjs/common";
import * as config from "config";
import {MongooseModule} from "@nestjs/mongoose";
import { OfflineData, OfflineDataSchema } from "src/schemas/OfflineData";
import { OfflineDataService } from "src/services/offline-data.service";






@Module({
    imports: [
        MongooseModule.forFeature([
            {name: OfflineData.name, schema: OfflineDataSchema},
           
            
        ]),
       
        
        
    ],
    providers: [OfflineDataService,],
    exports: [OfflineDataService],
    controllers: [],
   
})
export class OfflineDataModule {
}
