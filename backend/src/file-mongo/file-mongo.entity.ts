import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';

/**
 * File entity - a mongodb collection
 */
@Entity('files')
export class FileMongo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column('text')
  fileContent: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => ProjectMongo, (project) => project.files)
  project: ProjectMongo;

  @ManyToOne(() => DirectoryMongo, (directory) => directory.files)
  directory: DirectoryMongo;
}
