export interface RouteModel {
  name?: string;
  path?: string;
  icon?: string;
}
export interface NavModel {
  name: string;
  path: string;
  icon: string;
  children?: RouteModel[];
  key?: string;
}
export interface InvoiceItem {
  id: string;
  product?: ProductModel;
  quantity: number;
  amount: number;
  rate: number;
}

export interface Customer {
  id?: number;
  name: string;
  billing_address: string;
  shipping_address: string;
  email: string;
  phone?: string;
  registered_gst_member: boolean;
  gstin: string;
}
export interface SupplierModel {
  id?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  registered_gst_member?: boolean;
  gstin?: string;
}

export interface InvoiceModel {
  id?: string;
  items: InvoiceItem[];
  invoice_number?: string;
  date: string;
  billing_address?: string;
  shipping_address?: string;
  gross_total?: number;
  discount?: number;
  net_amount?: number;
  customer?: number;
  discount_percent?: number;
  taxable_amount?: number;
  cgst_percent?: number;
  sgst_percent?: number;
  igst_percent?: number;
  cgst_value?: number;
  sgst_value?: number;
  igst_value?: number;
  company?: string;
}

export interface PurchaseModel {
  id?: string;
  purchase_item: InvoiceItem[];
  invoice_number?: string;
  date: string;
  gross_total?: number;
  discount?: number;
  discount_percent?: number;
  taxable_amount?: number;
  cgst_percent?: number;
  sgst_percent?: number;
  igst_percent?: number;
  cgst_value?: number;
  sgst_value?: number;
  igst_value?: number;
  net_amount?: number;
  company?: string;
  supplier?: number;
}

export interface EstimateModel {
  id?: string;
  items: InvoiceItem[];
  invoice_number?: string;
  date: string;
  billing_address?: string;
  shipping_address?: string;
  gross_total?: number;
  discount?: number;
  net_amount?: number;
  customer?: number;
  discount_percent?: number;
}

export interface ProductModel {
  id?: number;
  code: string;
  name: string;
  brand: string;
  description: string;
  rate: number;
  hsn_code: string;
  quantity: number;
  unit: string;
}
interface PurchaseBill {
  id?: string;
  invoice_number?: string;
}
interface SaleBill {
  id?: string;
  invoice_number?: string;
}
export interface LedgerModel {
  company?: number;
  credit?: number;
  date?: string;
  debit?: number;
  purchase_bill?: PurchaseBill;
  sale_bill?: SaleBill;
  time?: number;
  id?: string;
}
