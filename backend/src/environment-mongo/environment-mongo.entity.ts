import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';
/**
 * Environments entity - a mongodb collection managing the environments
 * of all users. Each user has one environment.
 * Each environment has multiple projects.
 */

@Entity('environment')
export class EnvironmentMongo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @OneToMany(() => ProjectMongo, (project) => project.environment)
  projects: ProjectMongo[];
}
