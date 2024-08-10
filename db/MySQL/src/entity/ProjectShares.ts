import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Projects } from "./Projects"; // Import the Project entity
import { Users } from "./Users"; // Import the Users entity

@Entity({ name: "ProjectShares" })
@Index("IDX_PROJECT_USER", ["project_id", "user_id"], { unique: true }) // Composite unique index on project_id and user_id
export class ProjectShares {

  @PrimaryGeneratedColumn("uuid")
  share_id: string; // UUID for the share record, automatically generated

  @Column("uuid")
  project_id: string; // UUID of the project

  @Column("uuid")
  user_id: string; // UUID of the user with shared access

  @Column({ type: "enum", enum: ["read", "write"] })
  access_level: "read" | "write"; // Access level granted

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @ManyToOne(() => Projects, project => project.projectShares)
  @JoinColumn({ name: "project_id" }) // References project_id from the Projects table
  project: Projects;

  @ManyToOne(() => Users, user => user.projectShares)
  @JoinColumn({ name: "user_id" }) // References user_id from the Users table
  user: Users;
}

