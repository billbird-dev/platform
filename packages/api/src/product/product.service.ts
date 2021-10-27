import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
    @InjectRepository(CompanyEntity) private companyRepo: Repository<CompanyEntity>,
  ) {}

  async createProduct(product: CreateProductDto, companyId: number) {
    const productWithCodeExists = await this.productRepo.findOne({
      where: { code: product.code, company: companyId },
    });

    if (!!productWithCodeExists)
      throw new HttpException('Product exists with same code', HttpStatus.BAD_REQUEST);

    return await this.productRepo.create({ ...product, company: { id: companyId } }).save();
  }

  async getInventory(companyId: number) {
    return await this.productRepo.find({
      where: { company: companyId },
      loadRelationIds: { relations: ['company'] },
    });
  }

  async getParentInventory(parentId: number) {
    return await this.productRepo.find({
      where: { company: parentId },
      loadRelationIds: { relations: ['company'] },
    });
  }

  async getChildInventory(parentId: number, childId: number) {
    const parentWithChild = await this.companyRepo.find({
      where: { id: childId, parent: parentId },
      relations: ['parent'],
    });

    if (!parentWithChild.length)
      throw new HttpException("The requested child company doesn't belong to this company", 400);

    return await this.getInventory(childId);
  }

  async getProductById(companyId: number, productId: number) {
    const product = await this.productRepo.findOne({
      where: { company: companyId, id: productId },
      loadRelationIds: { relations: ['company'] },
    });

    if (!!product) return product;

    throw new HttpException('Product with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async updateProductById(companyId: number, productId: number, product: UpdateProductDto) {
    if (product.code) {
      const productWithCodeExists = await this.productRepo.find({
        where: [
          { code: product.code, company: companyId },
          { id: productId, company: companyId },
        ],
      });

      if (
        !!productWithCodeExists.length &&
        productWithCodeExists.some((prod) => prod.id !== productId && prod.code === product.code)
      )
        throw new HttpException('Product exists with same code', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.productRepo.update({ company: { id: companyId }, id: productId }, { ...product });

      return await this.getProductById(companyId, productId);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async deleteProductById(companyId: number, productId: number) {
    const doesProductExist = await this.getProductById(companyId, productId);

    if (!doesProductExist) throw new HttpException('Product not found', 400);

    await this.productRepo.delete({ company: { id: companyId }, id: productId });
  }
}
