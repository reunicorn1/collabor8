import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
  Response,
  Query,
  BadRequestException,
  Logger,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProjectSharesService } from './project-shares.service';
import { ProjectShares } from './project-shares.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ProjectSharesOutDto,
  CreateProjectShareDto,
  UpdateProjectShareDto,
} from './dto/create-project-shares.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Public } from '@auth/decorators/isPublic.decorator';

@ApiTags('ProjectShares')
@Controller('project-shares')
export class ProjectSharesController {
  constructor(
    private readonly projectSharesService: ProjectSharesService,
    @InjectQueue('mailer') private mailerQueue: Queue,
  ) { }

  // Create a new project share
  @ApiOperation({
    summary: 'Create a new project share',
    description: 'Create a new project share entry in the database.',
  })
  @Post()
  async create(
    @Body() createProjectShareDto: CreateProjectShareDto,
  ): Promise<ProjectSharesOutDto> {
    return this.projectSharesService.create(createProjectShareDto);
  }

  // Retrieve all project shares
  // TODO: move to admin
  @ApiOperation({
    summary: 'Retrieve all project shares',
    description: 'Retrieve a list of all project shares from the database.',
  })
  @Get()
  async findAll(): Promise<ProjectSharesOutDto[]> {
    return this.projectSharesService.findAll();
  }

  @Post('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares | { message: string }> {
    return this.projectSharesService.updateStatus(
      id,
      updateProjectShareDto.status,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('invite/:project_id')
  async inviteUser(
    @Param('project_id') project_id: string,
    @Query('access_level') access_level: 'write' | 'read',
    @Body()
    {
      inviter_email,
      invitee_email,
    }: { inviter_email: string; invitee_email: string },
    @Response() res,
  ) {
    /**
     * TODO:
     * swagger docs
     */
    await this.mailerQueue.add('invitation', {
      invitee_email,
      project_id,
      inviter_email,
      access_level
    });

    res.send({ message: 'Email sent successfully!' });
  }

  @Public()
  @Get('/invite/:project_id')
  async verifyInvitation(
    @Query('invitee_email') invitee_email: string,
    @Query('access_level') access_level: 'write' | 'read',
    @Param('project_id') project_id: string,
  ) {
    console.log('-------------------->')
    const user = await this.projectSharesService.inviteeHasAccount(invitee_email)
    let has_account = false;
    if (user) {
      // already has an account
      const ps = this.projectSharesService.create({
        project_id,
        username: user.username,
        access_level
      });
      has_account = true;
    }
    // new account
    return({message: 'success', has_account });
  }

  // Retrieve project shares by project ID
  @ApiOperation({
    summary: 'Retrieve project shares by project ID',
    description:
      'Retrieve all project shares associated with a specific project by its ID.',
  })
  @Get('/project/:project_id')
  async findByProject(@Param('project_id') project_id: string): Promise<any[]> {
    return this.projectSharesService.findByProject(project_id);
  }

  // Retrieve project shares by user ID
  @ApiOperation({
    summary: 'Retrieve project shares by user ID',
    description:
      'Retrieve all project shares associated with a specific user by their ID.',
  })
  @Get('/user/')
  async findByUser(@Request() req): Promise<ProjectSharesOutDto[]> {
    return this.projectSharesService.findByUser({
      username: req.user.username,
    });
  }

  // project criteria must be owner or contributor
  //
  @ApiOperation({
    summary: 'Get all projectShares of the logged in user',
    description:
      'Retrieve a list of all projectShares associated with the logged in user using username And is paginated.',
  })
  @Get('page')
  async findAllByUsernamePaginated(
    @Request() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ): Promise<any> {
    if (page && limit) {
      const { total, projects } =
        await this.projectSharesService.findAllByUsernamePaginated(
          req.user.username,
          page,
          limit,
          sort,
        );
      return {
        total,
        projects,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } else {
      throw new BadRequestException(
        'Page and limit query parameters are required',
      );
    }
  }

  // Update a project share
  @ApiOperation({
    summary: 'Update a project share',
    description:
      'Update the details of an existing project share using its ID.',
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectShareDto: Partial<UpdateProjectShareDto>,
  ): Promise<ProjectShares> {
    return this.projectSharesService.update(id, updateProjectShareDto);
  }
  // Retrieve a specific project share by ID
  @ApiOperation({
    summary: 'Retrieve a project share by ID',
    description: 'Retrieve a specific project share by its unique ID.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectSharesOutDto> {
    return this.projectSharesService.findOne(id);
  }

  // Delete a project share
  @ApiOperation({
    summary: 'Delete a project share',
    description:
      'Remove a specific project share from the database using its ID.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectSharesService.remove(id);
  }
}
