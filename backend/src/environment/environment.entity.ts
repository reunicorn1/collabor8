import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Environment entity - a mongodb collection
 */
@Entity({ name: 'Environments' })
export class environment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Add other columns here
}
