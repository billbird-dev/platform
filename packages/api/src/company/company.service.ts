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
    const { parent, is_parent, ...rest } = payload;

    const newCompany = await this.companyRepo.create({ ...rest }).save();

    const updatedCompany = this.updateCompany(newCompany.id, {
      parent: { id: is_parent ? newCompany.id : parent },
      is_parent,
    });

    return updatedCompany;
  }

  public async updateCompany(companyId: number, payload: QueryDeepPartialEntity<CompanyEntity>) {
    await this.companyRepo.update(companyId, payload);

    return await this.getById(companyId);
  }

  public async getById(id: number) {
    const company = await this.companyRepo.findOne(id, {
      loadRelationIds: {
        relations: ['parent'],
      },
    });

    if (!!company) return company;

    throw new HttpException('Company with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getChildren(companyId: number) {
    try {
      const children = await this.companyRepo.find({ parent: { id: companyId } });

      return children;
    } catch (error) {
      throw new HttpException('Some error occured', 500);
    }
  }

  async getCompanyIfRefreshTokenMatches(refreshToken: string, companyId: number) {
    if (!refreshToken || !companyId) throw new HttpException('Unauthorized', 401);

    const company = await this.getById(companyId);

    const isRefreshTokenMatching = await compare(
      refreshToken,
      company.current_hashed_refresh_token,
    );

    if (isRefreshTokenMatching) {
      return company;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, companyId: number) {
    const current_hashed_refresh_token = await hash(refreshToken, 10);

    await this.companyRepo.update(companyId, {
      current_hashed_refresh_token,
    });
  }

  async removeRefreshToken(companyId: number) {
    return this.companyRepo.update(companyId, {
      current_hashed_refresh_token: null,
    });
  }
}
