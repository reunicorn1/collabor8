import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Environment } from './environment-document.entity';
import { FileDocument } from './file-document.entity';
import { DirectoryDocument } from './directory-document.entity';

@Entity('projects')
export class ProjectDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectName: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Environment, (environment) => environment.projects)
  environment: Environment;

  @OneToMany(() => DirectoryDocument, (directory) => directory.project)
  directories: DirectoryDocument[];

  @OneToMany(() => FileDocument, (file) => file.project)
  files: FileDocument[];

  @Column('json', { default: [] })
  shared_with: Array<{ user_id: string; access_level: 'read' | 'write' }>;
}
