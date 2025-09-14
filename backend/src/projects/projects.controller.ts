import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(@Query('userId') userId: string): Promise<any> {
    return this.projectsService.findAll(userId);
  }

  @Post()
  create(
    @Body() data: { name: string; description?: string },
    @Query('userId') userId: string,
  ): Promise<any> {
    return this.projectsService.create(userId, data);
  }

  @Post(':id/notes')
  addNote(
    @Body() data: { content: string },
    @Query('projectId') projectId: string,
  ): Promise<any> {
    return this.projectsService.addNote(projectId, data.content);
  }

  @Get(':id/search')
  searchNotes(
    @Query('projectId') projectId: string,
    @Query('query') query: string,
  ): Promise<any> {
    return this.projectsService.searchNotes(projectId, query);
  }
}
