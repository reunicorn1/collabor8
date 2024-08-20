import { Entity, ObjectIdColumn, ObjectId, Column, ManyToOne } from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
import { DirectoryMongo } from '@directory-mongo/directory-mongo.entity';

/**
 * File entity - a mongodb collection
 */
@Entity('files')
export class FileMongo {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  file_name: string;

  @Column('text')
  file_content: string;

  @Column({ type: 'string', nullable: true })
  parent_id?: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => ProjectMongo, (project) => project.files)
  project: ProjectMongo;

  @ManyToOne(() => DirectoryMongo, (directory) => directory.files)
  directory: DirectoryMongo;
}
