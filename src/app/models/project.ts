import { User } from './user';

export interface Project {
    companyId: number;
    id: number;
    name: string;
    responsibleId: number;
    users: User[];
}
