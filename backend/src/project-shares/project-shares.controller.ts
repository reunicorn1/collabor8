import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Response,
  Query,
  BadRequestException,
  Logger,
  HttpStatus,
  HttpCode,
  Patch,
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
  ) {}

  // Create a new project share
  @ApiOperation({
    summary: 'Create a new project share',
    description: 'Create a new project share entry in the database.',
  })
  @Post()
  async create(
    @Body() createProjectShareDto: CreateProjectShareDto,
  ): Promise<ProjectSharesOutDto> {
    return await this.projectSharesService.create(createProjectShareDto);
  }

  // Retrieve all project shares
  // TODO: move to admin
  @ApiOperation({
    summary: 'Retrieve all project shares',
    description: 'Retrieve a list of all project shares from the database.',
  })
  @Get()
  async findAll(): Promise<ProjectSharesOutDto[]> {
    return await this.projectSharesService.findAll();
  }

  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateProjectShareDto: Partial<ProjectShares>,
  ): Promise<ProjectShares | { message: string }> {
    return await this.projectSharesService.updateStatus(
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
    let has_account = null;
    const user =
      await this.projectSharesService.inviteeHasAccount(invitee_email);
    if (user) has_account = user.username;

    await this.mailerQueue.add('invitation', {
      invitee_email,
      project_id,
      inviter_email,
      access_level,
      has_account,
    });

    res.send({ message: 'Email sent successfully!' });
  }

  @Public()
  @Get('/invite/:project_id')
  async verifyInvitation(
    @Query('invitee_email') invitee_email: string,
    @Query('has_account') has_account: string,
    @Query('access_level') access_level: 'write' | 'read',
    @Param('project_id') project_id: string,
    @Response() res,
  ): Promise<any> {
    console.log('-------------------->', {
      invitee_email,
      access_level,
      project_id,
      has_account,
    });
    //const user = await this.projectSharesService.inviteeHasAccount(invitee_email)
    //let has_account = false;
    if (has_account) {
      // already has an account
      const ps = await this.projectSharesService.create({
        project_id,
        username: has_account,
        access_level,
      });
    }
    // new account
    res.send({ message: 'success', has_account });
  }

  // Retrieve project shares by project ID
  @ApiOperation({
    summary: 'Retrieve project shares by project ID',
    description:
      'Retrieve all project shares associated with a specific project by its ID.',
  })
  @Get('/project/:project_id')
  async findByProject(@Param('project_id') project_id: string): Promise<any[]> {
    return await this.projectSharesService.findByProject(project_id);
  }


  @Get('/me/:project_id')
  async findMyShare(
    @Param('project_id') project_id: string,
    @Request() req,
  ): Promise<ProjectShares> {
    return await this.projectSharesService.findMyShare(req.user.username, project_id);
  }

  // Retrieve project shares by user ID
  @ApiOperation({
    summary: 'Retrieve project shares by user ID',
    description:
      'Retrieve all project shares associated with a specific user by their ID.',
  })
  @Get('/user/')
  async findByUser(@Request() req): Promise<ProjectSharesOutDto[]> {
    return await this.projectSharesService.findByUser({
      username: req.user.username,
    });
  }

  // generate agora token
  @ApiOperation({
    summary: 'Generate Agora Token',
    description: 'Generate Agora Token for a specific project share by its ID.',
  })
  @Get('room/token/:id')
  async getRoomToken(@Param('id') id: string, @Request() req): Promise<any> {
    return await this.projectSharesService.getRoomToken(req.user.username, id);
  }

  @Patch('/favorites/:id')
  async toggleFavorite(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<ProjectShares> {
    return await this.projectSharesService.toggleFavorite(
      req.user.username,
      id,
    );
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectShareDto: Partial<UpdateProjectShareDto>,
  ): Promise<ProjectShares> {
    return await this.projectSharesService.update(id, updateProjectShareDto);
  }
  // Retrieve a specific project share by ID
  @ApiOperation({
    summary: 'Retrieve a project share by ID',
    description: 'Retrieve a specific project share by its unique ID.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectSharesOutDto> {
    return await this.projectSharesService.findOne(id);
  }

  // Delete a project share
  @ApiOperation({
    summary: 'Delete a project share',
    description:
      'Remove a specific project share from the database using its ID.',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.projectSharesService.remove(id);
  }
}
