import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  // OneToOne,
  // JoinColumn,
  JoinTable,
} from 'typeorm';
import { Projects } from '@projects/project.entity';
import { ProjectShares } from '@project-shares/project-shares.entity';
// import { EnvironmentMongo } from '@environment-mongo/environment-mongo.entity';
import { Role } from '@auth/enums/role.enum';

@Entity({ name: 'Users' })
@Index('idx_username', ['username'], { unique: true })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id: string; // UUID autogenerated

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  // favorite languages list
  @Column('simple-array', { nullable: true })
  favorite_languages: string[] | null;

  // TODO: add profile picture and other user details as needed
  @Column({ type: 'varchar', nullable: true, default: '' })
  profile_picture: string | null;

  // bio
  @Column({ type: 'varchar', nullable: true, default: '' })
  bio: string | null;

  // default 'user'
  @Column({ type: 'enum', enum: Role, default: Role.User })
  roles: Role[]; // User roles

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', nullable: true })
  environment_id: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @OneToOne(() => EnvironmentMongo, (environment) => environment.user, {
  //   nullable: true,
  //   cascade: true,
  // })
  // @JoinColumn({ name: 'environment_id', referencedColumnName: '_id' })
  // environment: EnvironmentMongo | null; // User's environment

  @OneToMany(() => Projects, (project) => project.owner)
  ownedProjects: Projects[]; // Projects owned by the user

  @OneToMany(() => ProjectShares, (projectShare) => projectShare.user)
  projectShares: ProjectShares[]; // Project shares associated with the user

  // TODO: create favorite projects list

  @ManyToMany(() => Projects, (project) => project.favorite, {
    cascade: true,
  })
  @JoinTable()
  favorite_projects: Projects[];
}
