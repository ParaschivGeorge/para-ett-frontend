export interface TimesheetRecord {
    companyId: number;
    date: Date;
    id: number;
    managerId: number;
    noHours: number;
    overtime: boolean;
    projectId: number;
    userId: number;
}
