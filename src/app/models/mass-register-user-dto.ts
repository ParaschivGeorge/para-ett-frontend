export interface MassRegisterUserDto {
    email: string;
    firstName: string;
    freeDaysTotal: number;
    lastName: string;
    managerEmail: string;
    norm: number;
    type: string; // enum ADMIN, MANAGER, HR, EMPLOYEE, OWNER;
}
