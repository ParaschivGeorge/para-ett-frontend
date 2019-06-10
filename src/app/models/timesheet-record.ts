export interface TimesheetRecord {
    companyId: number;
    date: string;
    id: number;
    managerId: number;
    noHours: number;
    overtime: boolean;
    projectId: number;
    userId: number;
}
