import { IsNumber } from 'class-validator';

export class CreditDto {
  @IsNumber()
  credit: number;

  @IsNumber()
  sale_bill: number;
}

export class DebitDto {
  @IsNumber()
  debit: number;

  @IsNumber()
  purchase_bill: number;
}
