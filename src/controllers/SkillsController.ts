import { Controller, Get, Delete, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { SkillsService } from 'src/services/SkillsService';


@Controller('api/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  // Get all users
  @Get()
  async getAllUsers(): Promise<any> {
    return this.skillsService.getAllSkills();
  }

  @Post('skills-insert')
  async bulkInsert(@Body() skills:[]) {
    console.log("skills",skills)
    return this.skillsService.saveSkills(skills);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.skillsService.deleteSkillsById(id);
  }
}
