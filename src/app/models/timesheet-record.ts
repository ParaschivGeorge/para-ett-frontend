export interface TimesheetRecord {
    companyId: number;
    date: Date;
    id: number;
    noHours: number;
    overtime: boolean;
    projectId: number;
    userId: number;
}
