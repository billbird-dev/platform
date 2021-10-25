import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateCompanyDto, FindCompany } from './company.dto';
import { CompanyEntity } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepo: Repository<CompanyEntity>,
  ) {}

  public async getCompanyByEmailUsername(payload: FindCompany) {
    const company = await this.companyRepo.findOne(
      { ...payload },
      { loadRelationIds: { relations: ['parent'] } },
    );
    if (company) return company;

    throw new HttpException(
      "Company with provided credentials doesn't not exist",
      HttpStatus.NOT_FOUND,
    );
  }

  public async createCompany(payload: CreateCompanyDto) {
    const { parent, isParent, ...rest } = payload;

    const newCompany = await this.companyRepo.create({ ...rest }).save();

    const updatedCompany = this.updateCompany(newCompany.id, {
      parent: { id: isParent ? newCompany.id : parent },
      isParent,
    });

    return updatedCompany;
  }

  public async updateCompany(companyId: number, payload: QueryDeepPartialEntity<CompanyEntity>) {
    try {
      await this.companyRepo.update(companyId, payload);

      return await this.getById(companyId);
    } catch (error) {
      throw new HttpException('Some error occured', 500);
    }
  }

  public async getById(id: number) {
    const company = await this.companyRepo.findOne(id, {
      loadRelationIds: {
        relations: ['parent'],
      },
      // join: {
      //   alias: 'company',
      //   leftJoinAndSelect: {
      //     parent: 'company.parent',
      //   },
      // },
    });

    if (!!company) return company;

    throw new HttpException('Company with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getCompanyIfRefreshTokenMatches(refreshToken: string, companyId: number) {
    const company = await this.getById(companyId);

    const isRefreshTokenMatching = await compare(refreshToken, company.currentHashedRefreshToken);

    if (isRefreshTokenMatching) {
      return company;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, companyId: number) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);

    await this.companyRepo.update(companyId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(companyId: number) {
    return this.companyRepo.update(companyId, {
      currentHashedRefreshToken: null,
    });
  }
}
