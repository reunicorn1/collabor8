import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { FileMongo } from '@file-mongo/file-mongo.entity';

/**
 * Directory entity - a mongodb collection
 */
@Entity('directories')
export class DirectoryMongo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  directoryName: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => ProjectMongo, (project) => project.directories)
  project: ProjectMongo;

  @OneToMany(() => FileMongo, (file) => file.directory)
  files: FileMongo[];

  @OneToMany(() => DirectoryMongo, (directory) => directory.parent)
  children: DirectoryMongo[];

  @ManyToOne(() => DirectoryMongo, { nullable: true })
  parent: DirectoryMongo;
}
