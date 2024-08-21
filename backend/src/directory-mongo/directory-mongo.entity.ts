import {
  Entity,
  ObjectIdColumn,
  Column,
  ManyToOne,
  OneToMany,
  ObjectId,
} from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { FileMongo } from '@file-mongo/file-mongo.entity';

/**
 * Directory entity - a mongodb collection
 */
@Entity('directories')
export class DirectoryMongo {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  directory_name: string;

  @Column()
  created_at: Date;

  @Column({ type: 'string', nullable: true })
  parent_id?: string; // Use string for ObjectId

  @Column()
  project_id: string;

  @ManyToOne(() => ProjectMongo, (project) => project.directories)
  project: ProjectMongo;

  @OneToMany(() => FileMongo, (file) => file.directory)
  files: FileMongo[];

  @OneToMany(() => DirectoryMongo, (directory) => directory.parent)
  children: DirectoryMongo[];

  @ManyToOne(() => DirectoryMongo, (directory) => directory.children, {
    nullable: true,
  })
  parent: DirectoryMongo;
}
