import { ProductEntity } from 'src/product/product.entity';

export interface SaleItem {
  id: string;
  product: ProductEntity;
  invoice: string;
  quantity: number;
  rate: number;
  amount: number;
}
