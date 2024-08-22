import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';
import { FileMongo } from '@file-mongo/file-mongo.entity';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';

@Entity('projects')
export class ProjectMongo {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  project_name: string;

  @Column() // passed from mysql
  project_id: string;

  @Column()
  owner_id: string;

  @Column()
  username: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column({ nullable: true })
  environment_id: string;

  @ManyToOne(() => EnvironmentMongo, (environment) => environment.projects)
  environment: EnvironmentMongo;

  @OneToMany(() => DirectoryMongo, (directory) => directory.project)
  directories: DirectoryMongo[];

  @OneToMany(() => FileMongo, (file) => file.project)
  files: FileMongo[];

  @Column('json', { default: [] })
  shared_with: Array<{ user_id: string; access_level: 'read' | 'write' }>;
}
