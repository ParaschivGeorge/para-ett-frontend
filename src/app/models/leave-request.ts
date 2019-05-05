export interface LeaveRequest {
    approved: true;
    companyId: number;
    date: Date;
    id: number;
    managerId: number;
    type: string; // enum TODO
    userId: number;
}
