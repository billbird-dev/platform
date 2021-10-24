import { CompanyEntity } from './company.entity';

export interface FindCompany {
  email?: string;
  username?: string;
}

export interface CreateCompanyDto {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: number;
  isPremiumMember: boolean;
  isParent: boolean;
  parent: Partial<CompanyEntity>;
  branch: string;
  address: string;
  city: string;
  state: string;
  pinCode: number;
  gstin: string;
  stateCode: string;
  validTill: Date;
}
