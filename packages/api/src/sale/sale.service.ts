import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleService {
  create(createSaleDto: any) {
    return 'This action adds a new sale';
  }

  findAll() {
    return `This action returns all sale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: any) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
