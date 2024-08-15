import { Entity, ObjectIdColumn, ObjectId, Column, ManyToOne } from 'typeorm';
import { ProjectMongo } from '@project-mongo/project-mongo.entity';

/**
 * SharedWith entity - a mongodb collection
 */
@Entity('project_shares')
export class ProjectSharesMongo {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  user_id: string;

  @Column()
  access_level: 'read' | 'write';

  @ManyToOne(() => ProjectMongo, (project) => project.shared_with)
  project: ProjectMongo;
}
