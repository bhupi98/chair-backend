import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { UpdateProfileDTO } from 'src/dto/UpdateProfileDTO';

import { Skills } from 'src/schemas/Skills';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skills.name) private skillsModel: Model<Skills>,
 
    
  ) {}
  
  async saveSkills(skills:Array<any>) {
    try {
      const res =await this.skillsModel.insertMany(skills, { ordered: false });
      console.log("res",res)
      return res
    } catch (error) {
      console.error('Bulk insert error:', error);
      throw new Error('Bulk insert failed');
    }
  }
  async getAllSkills(): Promise<any> {
    return this.skillsModel.find().exec();
  }
  async deleteSkillsById(id: string): Promise<{ message: string }> {
    const result = await this.skillsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`skill with ID ${id} not found`);
    }
    return { message: 'skills deleted successfully' };
  }

}
