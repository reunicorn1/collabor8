import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProjectDocument } from './project-document.entity';
import { FileDocument } from './file-document.entity';

/**
 * FileOrDirectory entity - a mongodb collection
 */
@Entity({ name: 'DirectoryDocument' })
export class DirectoryDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  directoryName: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => ProjectDocument, (project) => project.directories)
  project: ProjectDocument;

  @OneToMany(() => FileDocument, (file) => file.directory)
  files: FileDocument[];

  @OneToMany(() => DirectoryDocument, (directory) => directory.parent)
  children: DirectoryDocument[];

  @ManyToOne(() => DirectoryDocument, { nullable: true })
  parent: DirectoryDocument;
}
