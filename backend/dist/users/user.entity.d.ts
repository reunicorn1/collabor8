import { Projects } from '@projects/project.entity';
import { ProjectShares } from '@project-shares/project-shares.entity';
export declare class Users {
    user_id: string;
    username: string;
    email: string;
    password_hash: string;
    environment_id: string | null;
    created_at: Date;
    updated_at: Date;
    ownedProjects: Projects[];
    projectShares: ProjectShares[];
}
