import { Request } from 'express';
import { CompanyEntity } from 'src/company/company.entity';

export interface TokenPayload {
  companyId: number;
}

export interface RequestWithCompany extends Request {
  company: CompanyEntity;
  companyId?: string;
}
