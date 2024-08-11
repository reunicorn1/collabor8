import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProjectDocument } from './project-document.entity';

/**
 * SharedWith entity - a mongodb collection
 */
@Entity({ name: 'SharedWith' })
export class SharedWith {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  access_level: 'read' | 'write';

  @ManyToOne(() => ProjectDocument, (project) => project.shared_with)
  project: ProjectDocument;
}
