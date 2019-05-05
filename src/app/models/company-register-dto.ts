import { Company } from './company';
import { OwnerRegisterUserDto } from './owner-register-user-dto';

export interface CompanyRegisterDto {
    company: Company;
    ownerRegisterUserDto: OwnerRegisterUserDto;
}
