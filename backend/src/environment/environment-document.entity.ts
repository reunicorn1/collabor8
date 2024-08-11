import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectDocument } from './project-document.entity';
/**
 * Environments entity - a mongodb collection managing the environments
 * of all users. Each user has one environment.
 * Each environment has multiple projects.
 */

@Entity()
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @OneToMany(() => ProjectDocument, (project) => project.environment)
  projects: ProjectDocument[];
}
