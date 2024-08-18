import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from '@users/user.entity';
import { ProjectShares } from '@project-shares/project-shares.entity';

@Entity({ name: 'Projects' })
export class Projects {
  @PrimaryColumn({ type: 'varchar', length: 100, nullable: false })
  project_id: string;

  @Column({ type: 'varchar', length: 100 })
  project_name: string;

  @Column('uuid')
  owner_id: string;

  @Column({ type: 'varchar', nullable: true })
  environment_id: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.ownedProjects)
  @JoinColumn({ name: 'owner_id' }) // References owner_id from the Users table
  owner: Users;

  @OneToMany(() => ProjectShares, (projectShare) => projectShare.project)
  projectShares: ProjectShares[];
}
