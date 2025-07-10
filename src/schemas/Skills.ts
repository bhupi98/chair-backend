
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Skills {
 
  @Prop({ type: String,required:true })
  label: string ; // For one-to-one chats, null for groups
  @Prop({ type: String,required:true })
  value: string ; // For one-to-one chats, null for groups
  @Prop({ type: String,required:true })
  hindi:string 
 
  
}

export const SkillsSchema = SchemaFactory.createForClass(Skills);
