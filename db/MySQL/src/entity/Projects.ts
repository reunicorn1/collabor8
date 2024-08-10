import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./Users"; // Import the User entity
import { ProjectShares } from "./ProjectShares"; // Import the ProjectShares entity

@Entity({ name: "Projects" })
export class Projects {

    @PrimaryGeneratedColumn("uuid")
    project_id: string; 

    @Column({ type: "varchar", length: 100 })
    project_name: string;

    @Column("uuid")
    owner_id: string; 

    @Column("uuid")
    environment_id: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;

    @ManyToOne(() => Users, user => user.ownedProjects)
    @JoinColumn({ name: "owner_id" }) // References owner_id from the Users table
    owner: Users;

    @OneToMany(() => ProjectShares, projectShare => projectShare.project)
    projectShares: ProjectShares[];
}

