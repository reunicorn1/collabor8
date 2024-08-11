import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectDocument } from './project-document.entity';
import { DirectoryDocument } from './directory-document.entity';

/**
 * FileDocument entity - a mongodb collection
 */
@Entity({ name: 'FileDocument' })
export class FileDocument {
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

  @ManyToOne(() => ProjectDocument, (project) => project.files)
  project: ProjectDocument;

  @ManyToOne(() => DirectoryDocument, (directory) => directory.files)
  directory: DirectoryDocument;
}
