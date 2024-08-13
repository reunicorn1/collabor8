import {
  Entity,
  Column,
  OneToMany,
  ObjectIdColumn,
  ObjectId,
  // OneToOne,
} from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
// import { Users } from '@users/user.entity';
/**
 * Environments entity - a mongodb collection managing the environments
 * of all users. Each user has one environment.
 * Each environment has multiple projects.
 */

@Entity({ name: 'environment' })
export class EnvironmentMongo {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  username: string;

  @OneToMany(() => ProjectMongo, (project) => project.environment)
  projects: ProjectMongo[];

  // @OneToOne(() => Users, (user) => user.environment)
  // user: Users;
}
