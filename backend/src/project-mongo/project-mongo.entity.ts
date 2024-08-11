import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EnvironmentMongo } from '@envrionment-mongo/envrionment-mongo.entity';
import { FileMongo } from '@file-mongo/file-mongo.entity';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';

@Entity('projects')
export class ProjectMongo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectName: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => EnvironmentMongo, (environment) => environment.projects)
  environment: EnvironmentMongo;

  @OneToMany(() => DirectoryMongo, (directory) => directory.project)
  directories: DirectoryMongo[];

  @OneToMany(() => FileMongo, (file) => file.project)
  files: FileMongo[];

  @Column('json', { default: [] })
  shared_with: Array<{ user_id: string; access_level: 'read' | 'write' }>;
}
