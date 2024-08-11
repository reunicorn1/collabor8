import { Projects } from '@projects/project.entity';
import { Users } from '@users/user.entity';
export declare class ProjectShares {
    share_id: string;
    project_id: string;
    user_id: string;
    access_level: 'read' | 'write';
    created_at: Date;
    updated_at: Date;
    project: Projects;
    user: Users;
}
