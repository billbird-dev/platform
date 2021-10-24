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
  serial?: string;
  product?: string;
  quantity?: number;
  rate?: number;
  amount?: number;
  name?: string;
}

export interface CustomerBlock {
  id?: string;
  name?: string;
  billing_address?: string;
  shipping_address?: string;
  email?: string;
  phone?: number;
  registered_gst_member?: boolean;
  gstin?: string;
}
export interface SupplierModel {
  id?: string;
  name?: string;
  address?: string;
  email?: string;
  phone?: number;
  registered_gst_member?: boolean;
  gstin?: string;
}

export interface InvoiceModel {
  id?: string;
  sale_item?: InvoiceItem[];
  invoice_number?: string;
  date?: string;
  billing_address?: string;
  shipping_address?: string;
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
  customer_id?: string;
}
export interface PurchaseModel {
  id?: string;
  purchase_item?: InvoiceItem[];
  invoice_number?: string;
  date?: string;
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
  supplier?: string;
}
export interface InvoiceModel {
  id?: string;
  sale_item?: InvoiceItem[];
  invoice_number?: string;
  date?: string;
  billing_address?: string;
  shipping_address?: string;
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
  customer?: string;
}

export interface EstimateModel {
  id?: string;
  estimate_item?: InvoiceItem[];
  invoice_number?: string;
  date?: string;
  billing_address?: string;
  shipping_address?: string;
  gross_total?: number;
  discount?: number;
  net_amount?: number;
  customer?: string;
  discount_percent?: number;
}

export interface ProductModel {
  id?: string;
  code?: string;
  name?: string;
  brand?: string;
  description?: string;
  hsn_code?: string;
  quantity?: number;
  unit?: string;
  rate?: number;
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
