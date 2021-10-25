import { Request } from 'express';
import { CompanyEntity } from '../company/company.entity';

export interface TokenPayload {
  companyId: number;
}

export interface CompanyWithParent extends Omit<CompanyEntity, 'parent'> {
  parent: number;
}

export interface RequestWithCompany extends Request {
  user: CompanyWithParent;
  userId?: string;
}
