import { Project } from './project';

export interface User {
    companyId: number;
    email: string;
    firstName: string;
    freeDaysLeft: number;
    id: number;
    lastLoginDate: Date;
    lastName: string;
    managerId: number;
    norm: number;
    projects: Project[];
    type: string; // enum ADMIN, MANAGER, HR, EMPLOYEE, OWNER;
}
