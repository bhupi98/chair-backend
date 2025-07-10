import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';

import { ChatModule } from './modules/chat.module';

import { APP_FILTER } from '@nestjs/core';

import { GlobalExceptionFilter } from './GlobalExceptionFilter';
import { OfflineDataModule } from './modules/OfflineDataModule';

import { ScheduleModule } from '@nestjs/schedule';
import { OrderModule } from './modules/Order.module';


// const MongoConfig = config.get("db");
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,            // makes env vars available app-wide
      envFilePath: '.env',      // load .env file
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri:  process.env.MONGO_URL,
        connectionFactory: (connection) => {
          console.log('MongoDB Connected');
          return connection;
        },
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 10,
    }]),
    ScheduleModule.forRoot(),
    HttpModule,
    AuthModule,
   
   OfflineDataModule,  // Import OfflineDataModule
   ChatModule,
   OrderModule
  
  ],
  controllers: [AppController],
  
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard, // Applies the guard globally
  },AppService,{
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
    
  }],
})
export class AppModule {
 
}
