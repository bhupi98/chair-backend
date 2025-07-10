import * as dayjs from "dayjs";
import * as mongoose from 'mongoose';
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);
import { v4 as uuidv4 } from "uuid";
export const getTodayDate=()=>{
    const today = dayjs().format("llll") 
   return  today
}
export const convertStringToMongoID=(id)=>{
   
   return  new mongoose.Types.ObjectId(id)
}
export const generateMessageId = (): string => {
    return uuidv4(); // Generates a UUID like '123e4567-e89b-12d3-a456-426614174000'
  };