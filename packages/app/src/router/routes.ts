import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AppLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'Landing' },
      { path: '/login', component: () => import('pages/Login.vue'), name: 'Login' },
      { path: 'home', component: () => import('pages/User/Index.vue'), name: 'Home' },
      { path: 'bill', component: () => import('pages/Bill/Index.vue'), name: 'Bill' },
      { path: 'bill/all', component: () => import('pages/Listing.vue'), name: 'BillListing' },
      { path: 'estimate', component: () => import('pages/Estimate/Index.vue'), name: 'Estimate' },
      {
        path: 'estimate/all',
        component: () => import('pages/Listing.vue'),
        name: 'EstimateListing',
      },
      { path: 'purchase', component: () => import('pages/Purchase/Index.vue'), name: 'Purchase' },
      {
        path: 'purchase/all',
        component: () => import('pages/Listing.vue'),
        name: 'PurchaseListing',
      },
      {
        path: 'inventory',
        component: () => import('pages/Inventory/Index.vue'),
        name: 'Inventory',
      },
      {
        path: 'customer',
        component: () => import('pages/Customer/Index.vue'),
        name: 'Customer',
      },
      {
        path: 'supplier',
        component: () => import('pages/Supplier/Index.vue'),
        name: 'Supplier',
      },
      { path: 'ledger', component: () => import('pages/Ledger/Index.vue'), name: 'Ledger' },

      {
        path: 'invoice/bill/:id',
        component: () => import('pages/Invoice.vue'),
        name: 'BillInvoice',
      },
      {
        path: 'invoice/estimate/:id',
        component: () => import('pages/Invoice.vue'),
        name: 'EstimateInvoice',
      },
      {
        path: 'invoice/purchase/:id',
        component: () => import('pages/Invoice.vue'),
        name: 'PurchaseInvoice',
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
