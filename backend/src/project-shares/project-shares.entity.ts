import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Projects } from '@projects/project.entity';
import { Users } from '@users/user.entity';

@Entity('project_shares')
@Index('IDX_PROJECT_USER', ['project_id', 'user_id'], { unique: true }) // Composite unique index on project_id and user_id
export class ProjectShares {
  @PrimaryGeneratedColumn('uuid')
  share_id: string;

  @Column('uuid')
  project_id: string;

  @Column('uuid')
  user_id: string;

  // TODO: Add favorite boolean
  @Column({ type: 'boolean', default: false })
  favorite: boolean;

  @Column({ type: 'enum', enum: ['read', 'write'] })
  access_level: 'read' | 'write'; // Access level granted

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Projects, (project) => project.projectShares)
  @JoinColumn({ name: 'project_id' }) // References project_id from the Projects table
  project: Projects;

  @ManyToOne(() => Users, (user) => user.projectShares)
  @JoinColumn({ name: 'user_id' }) // References user_id from the Users table
  user: Users;
}
