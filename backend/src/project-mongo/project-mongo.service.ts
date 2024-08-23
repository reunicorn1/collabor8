import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { ProjectMongo } from './project-mongo.entity';
import { DirectoryMongoService } from '@directory-mongo/directory-mongo.service';
import { FileMongoService } from '@file-mongo/file-mongo.service';
import { UsersService } from '@users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  parseCreateProjectMongoDto,
  CreateProjectMongoDto,
  parseUpdateProjectMongoDto,
  UpdateProjectMongoDto,
} from './dto/create-project-mongo.dto';

// TODO: refactor to move helper functions to relevant service providers
// to avoid code duplication and make code more modular
@Injectable()
export class ProjectMongoService {
  constructor(
    @InjectRepository(ProjectMongo, 'mongoConnection')
    private projectMongoRepository: Repository<ProjectMongo>,
    @Inject(forwardRef(() => DirectoryMongoService))
    private directoryService: DirectoryMongoService,
    @Inject(forwardRef(() => FileMongoService))
    private fileService: FileMongoService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(createProjectDto: CreateProjectMongoDto): Promise<ProjectMongo> {
    const parsedDto = parseCreateProjectMongoDto(createProjectDto);
    const newProject = this.projectMongoRepository.create({
      project_name: parsedDto.project_name,
      environment_id: parsedDto.environment_id,
      owner_id: parsedDto.owner_id,
    });
    return await this.projectMongoRepository.save(newProject);
  }

  async findAll(): Promise<ProjectMongo[]> {
    const projects = await this.projectMongoRepository.find({
      relations: ['environment', 'directories', 'files'],
    });
    return projects;
  }

  async findAllByEnvironment(environment_id: string): Promise<ProjectMongo[]> {
    const projs = await this.projectMongoRepository.find({
      where: { environment_id: environment_id },
      relations: ['environment'],
    });
    return projs;
  }

  // general method to find all projects by a field
  async findAllBy(field: string, value: string): Promise<ProjectMongo[]> {
    const projects = await this.projectMongoRepository.find({
      where: { [field]: value },
    });
    return projects;
  }


  // Find projects by username
  async findAllByUsername(username: string): Promise<ProjectMongo[]> {
    const user = await this.usersService.findOneBy({ username });
    if (!user) {
      return []; // Handle case where user is not found
    }

    const projects = await this.projectMongoRepository.find({
      where: { environment_id: user.environment_id },
    });

    const enhancedProjects = await Promise.all(
      projects.map(async (project) => {
        const directories = await this.directoryService.findDirectoriesByParent(
          project._id.toString(),
        );
        directories.map(async (dir) => {
          const files = await this.fileService.findFilesByParent(
            dir._id.toString(),
          );
          dir.files = files;
        });

        const files = await this.fileService.findFilesByParent(
          project._id.toString(),
        );
        project.directories = directories;
        project.files = files;

        return project;
      }),
    );

    return enhancedProjects;
  }

  async findAllByUsernameDepth(
    username: string,
    maxDepth: number,
    id: string,
  ): Promise<ProjectMongo[]> {
    const user = await this.usersService.findOneBy({ username });
    let projects: ProjectMongo[] = [];
    if (!user) {
      return []; // Handle case where user is not found
    }
    if (maxDepth < 0) {
      maxDepth = 99999999;
    }
    if (id) {
      projects = await this.projectMongoRepository.find({
        where: { environment_id: user.environment_id, _id: new ObjectId(id) },
      });
    } else {
      projects = await this.projectMongoRepository.find({
        where: { environment_id: user.environment_id },
      });
    }

    // Helper function to load directories and files recursively
    const loadDirectories = this.directoryService.loadDirectoriesByDepth;

    // Enhance projects with directories and files
    const enhancedProjects = await Promise.all(
      projects.map(async (project) => {
        const directories = await loadDirectories(
          project._id.toString(),
          maxDepth,
        );

        const files = await this.fileService.findFilesByParent(
          project._id.toString(),
        );
        project['children'] = [directories, files];

        return project;
      }),
    );

    return enhancedProjects;
  }

  findOne(_id: string): Promise<ProjectMongo | null> {
    return this.projectMongoRepository.findOneBy({ project_id: _id });
  }

    async update(
    id: string,
    updateProjectDto: UpdateProjectMongoDto,
  ): Promise<ProjectMongo | null | { message: string }> {
    const parsedDto = parseUpdateProjectMongoDto(updateProjectDto);
    const newDate = new Date();
    // approach 1
    const updateResult = await this.projectMongoRepository.update(id, {
      project_name: parsedDto.project_name,
      updated_at: newDate,
    });
    if (!updateResult.affected) {
      throw new Error('Project not found');
    }
    return { message: 'Project updated successfully' };
  }



  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    const directories = await this.directoryService.findDirectoriesByParent(
      id,
    );
    const files = await this.fileService.findFilesByParent(id);
    await Promise.all(
      directories.map(async (dir) => {
        await this.directoryService.remove(dir._id.toString());
      }),
    );
    await Promise.all(
      files.map(async (file) => {
        await this.fileService.remove(file._id.toString());
      }),
    );
    await this.projectMongoRepository.delete(
      { project_id: id },
    );
  }

  async removeAllByEnvironment(environment_id: string): Promise<void> {
    await this.projectMongoRepository.delete({ environment_id });
  }


  // TODO: Fix this function
  // Doesnt work when startDepth is greater than 1
  // async findProjectsWithPaging(
  //   username: string,
  //   startDepth: number,
  //   endDepth: number,
  // ): Promise<ProjectMongo[]> {
  //   const user = await this.usersService.findOneBy({ username });
  //   if (!user) {
  //     return []; // Handle case where user is not found
  //   }
  //   const projects = await this.projectMongoRepository.find({
  //     where: { environment_id: user.environment_id },
  //   });

  //   // Helper function to load directories and files recursively with depth control
  //   const loadDirectories = async (
  //     parentId: string,
  //     depth: number,
  //   ): Promise<DirectoryMongo[]> => {
  //     if (depth < startDepth || depth > endDepth) return []; // Handle depth range
  //     const directories = await this.directoryRepository.find({
  //       where: { parent_id: parentId },
  //     });

  //     // Load files for each directory
  //     await Promise.all(
  //       directories.map(async (dir) => {
  //         dir.files = await this.fileRepository.find({
  //           where: { parent_id: dir._id.toString() },
  //         });

  //         // Recursively load child directories
  //         dir.children = await loadDirectories(dir._id.toString(), depth + 1);
  //       }),
  //     );
  //     return directories;
  //   };

  //   // Enhance projects with directories and files
  //   const enhancedProjects = await Promise.all(
  //     projects.map(async (project) => {
  //       const directories = await loadDirectories(project._id.toString(), 1); // Start at depth 1

  //       const files = await this.fileRepository.find({
  //         where: { parent_id: project._id.toString() },
  //       });

  //       project.directories = directories;
  //       project.files = files;

  //       return project;
  //     }),
  //   );
  //   console.log(enhancedProjects);
  //   return enhancedProjects;
  // }
}
