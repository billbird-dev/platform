import { IsNumber, IsObject, IsString } from 'class-validator';
import { ProductEntity } from 'src/product/product.entity';

export class SaleItem {
  @IsString()
  id: string;

  @IsObject()
  product: ProductEntity;

  @IsNumber()
  quantity: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  rate: number;
}
