import { IsNumber, IsObject, IsString } from 'class-validator';
import { ProductEntity } from 'src/product/product.entity';

export class EstimateItem {
  @IsString()
  id: string;

  @IsObject()
  product: ProductEntity;

  @IsNumber()
  quantity: number;

  @IsNumber()
  amount: number;
}
