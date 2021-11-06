import { NavModel } from 'src/types/interfaces';

export const CustomerTableColumns: any[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: any) => row.name,
    sortable: true,
  },
  {
    name: 'phone',
    required: true,
    label: 'Phone',
    align: 'left',
    field: (row: any) => row.name,
    sortable: true,
  },
  {
    name: 'gstin',
    required: true,
    label: 'GSTIN',
    align: 'left',
    field: (row: any) => row.name,
    sortable: true,
  },
];
export const InvoiceListingColumns: any[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row: any) => row.date,
    sortable: true,
  },
  {
    name: 'invoice_number',
    required: true,
    label: 'Invoice no.',
    align: 'left',
    field: (row: any) => row.invoice_number,
    sortable: true,
  },
  {
    name: 'gross_total',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row: any) => row.gross_total,
    sortable: true,
  },
  {
    name: 'customer',
    required: true,
    label: 'Customer',
    align: 'left',
    field: (row: any) => row.customer.name,
    sortable: true,
  },
];
export const PurchaseListingColumns = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row: any) => row.date,
    sortable: true,
  },
  {
    name: 'invoice_number',
    required: true,
    label: 'Invoice no.',
    align: 'left',
    field: (row: any) => row.invoice_number,
    sortable: true,
  },
  {
    name: 'gross_total',
    required: true,
    label: 'Amount',
    align: 'left',
    field: (row: any) => row.gross_total,
    sortable: true,
  },
  {
    name: 'supplier',
    required: true,
    label: 'Supplier',
    align: 'left',
    field: (row: any) => row.supplier.name,
    sortable: true,
  },
];
export const InventoryTableColumns: any[] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: any) => row.name,
    sortable: true,
  },
  {
    name: 'brand',
    required: true,
    label: 'Brand',
    align: 'left',
    field: (row: any) => row.brand,
    sortable: true,
  },
  {
    name: 'code',
    required: true,
    label: 'Code',
    align: 'left',
    field: (row: any) => row.code,
    sortable: true,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'left',
    field: (row: any) => row.quantity,
    sortable: true,
  },
];

export const LedgerTableColumns: any[] = [
  {
    name: 'date',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row: any) => row.date,
    sortable: true,
  },
  {
    name: 'time',
    required: true,
    label: 'Time',
    align: 'left',
    field: (row: any) => row.time,
    sortable: true,
  },
  {
    name: 'type',
    required: true,
    label: 'Type',
    align: 'left',
    field: (row: any) => (row.sale_bill ? 'sale' : 'purchase'),
    sortable: true,
  },
  {
    name: 'no',
    required: true,
    label: 'Bill No.',
    align: 'left',
    field: (row: any) =>
      row.purchase_bill ? row.purchase_bill.invoice_number : row.sale_bill.invoice_number,
    sortable: true,
  },
  {
    name: 'credit',
    required: true,
    label: 'Credit',
    align: 'left',
    field: (row: any) => row.credit,
    sortable: true,
  },
  {
    name: 'debit',
    required: true,
    label: 'Debit',
    align: 'left',
    field: (row: any) => row.debit,
    sortable: true,
  },
];

export const BillColumns = ['Sl.', 'Item Name', 'Rate', 'Quantity', 'Amount'];
export const TopNewNav: NavModel[] = [
  {
    name: ' New invoice',
    icon: 'las la-file-invoice-dollar',
    path: '/bill',
  },
  {
    name: 'New estimate',
    icon: 'las la-file-invoice',
    path: '/estimate',
  },
  {
    path: '/purchase',
    icon: 'las la-shopping-cart',
    name: 'New purchase',
  },
];
export const MainNav: { [x: string]: NavModel[] } = {
  bill: [
    {
      name: 'Invoice',
      icon: 'las la-file-invoice',
      path: '/bill',
    },
    {
      name: 'All invoices',
      icon: 'las la-file-invoice',
      path: '/bill/all',
    },
    {
      name: 'Customer',
      icon: 'las la-users',
      path: '/customer',
    },
    {
      name: 'Inventory',
      icon: 'las la-boxes',
      path: '/inventory',
    },
  ],
  estimate: [
    {
      name: 'Estimate',
      icon: 'las la-file-invoice',
      path: '/estimate',
    },
    {
      name: 'All estimates',
      icon: 'las la-file-invoice',
      path: '/estimate/all',
    },
    {
      name: 'Customer',
      icon: 'las la-users',
      path: '/customer',
    },
    {
      name: 'Inventory',
      icon: 'las la-boxes',
      path: '/inventory',
    },
  ],
  purchase: [
    {
      name: 'Purchase',
      path: '/purchase',
      icon: 'las la-shopping-cart',
    },
    {
      path: '/purchase/all',
      icon: 'las la-shopping-cart',
      name: 'All purchases',
    },
    {
      name: 'Supplier',
      icon: 'las la-user-tie',
      path: '/supplier',
    },
    {
      name: 'Inventory',
      icon: 'las la-boxes',
      path: '/inventory',
    },
  ],
  inventory: [
    {
      name: 'Inventory',
      icon: 'las la-boxes',
      path: '/inventory',
    },
  ],
  customer: [
    {
      name: 'Customer',
      icon: 'las la-users',
      path: '/customer',
    },
  ],
  supplier: [
    {
      name: 'Supplier',
      icon: 'las la-user-tie',
      path: '/supplier',
    },
  ],
  ledger: [
    {
      name: 'Ledger',
      icon: 'las la-file-invoice-dollar',
      path: '/ledger',
    },
  ],
};
