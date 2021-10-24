import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto, FindCompany } from './company.dto';
import { CompanyEntity } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepo: Repository<CompanyEntity>,
  ) {}

  public async getCompanyByEmailUsername(payload: FindCompany) {
    const company = await this.companyRepo.findOne({ ...payload });
    if (company) return company;

    throw new HttpException(
      "Company with provided credentials doesn't not exist",
      HttpStatus.NOT_FOUND,
    );
  }

  public async createCompany(payload: CreateCompanyDto) {
    const newCompany = await this.companyRepo.create({ ...payload }).save();
    return newCompany;
  }

  public async getById(id: number) {
    const company = await this.companyRepo.findOne(id);
    if (!!company) return company;

    throw new HttpException('Company with this id does not exist', HttpStatus.NOT_FOUND);
  }
}
