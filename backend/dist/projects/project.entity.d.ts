import { Users } from '@users/user.entity';
import { ProjectShares } from '@project-shares/project-shares.entity';
export declare class Projects {
    project_id: string;
    project_name: string;
    owner_id: string;
    environment_id: string;
    created_at: Date;
    updated_at: Date;
    owner: Users;
    projectShares: ProjectShares[];
}
