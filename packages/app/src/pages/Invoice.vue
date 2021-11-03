<script setup lang="ts">
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { formatDate, useNotify } from 'src/utils/helpers';
import { api } from 'src/boot/axios';
import { useStore } from 'vuex';
import { Company } from 'src/store/user';

const route = useRoute();
const { loading } = useQuasar();

const store = useStore();

const user = computed((): Company => store.getters['users/getUser']);

const invoice = ref<Record<string, any | Record<string, any>>>({
  supplier: {},
  customer: {},
  company: {},
  sale_item: [],
  purchase_item: [],
  estimate_item: [],
});

const isLoading = ref(false);

watchEffect(() => {
  if (isLoading.value) return loading.show();
  if (!isLoading.value) return loading.hide();
});

onMounted(async () => {
  if (route.path.includes('bill')) return await getInvoice();

  if (route.path.includes('estimate')) return await getEstimate();

  if (route.path.includes('purchase')) return await getPurchase();
});

async function getInvoice() {
  isLoading.value = true;

  try {
    const { data } = await api.get('/sale/invoice', {
      params: { id: route.params.id, company: user.value.id },
    });

    invoice.value = data;
  } catch (error) {
    console.log(error);
    useNotify('negative', 'Failed to fetch invoice !');
  } finally {
    isLoading.value = false;
  }
}

async function getEstimate() {
  isLoading.value = true;

  try {
    const { data } = await api.get('/estimate/invoice', {
      params: { id: route.params.id, company: user.value.id },
    });

    invoice.value = data;
  } catch (error) {
    console.log(error);
    useNotify('negative', 'Failed to fetch estimate !');
  } finally {
    isLoading.value = false;
  }
}

async function getPurchase() {
  isLoading.value = true;

  try {
    const { data } = await api.get('/purchase/invoice', {
      params: { id: route.params.id, company: user.value.id },
    });

    invoice.value = data;
  } catch (error) {
    console.log(error);
    useNotify('negative', 'Failed to fetch purchase !');
  } finally {
    isLoading.value = false;
  }
}

function print() {
  window.print();
}
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <div class="invoice">
      <div class="row">
        <div class="col-sm-6 col-md-6 col-xs-6">
          <div>
            <h5>{{ invoice.company.name }}</h5>
            <p>{{ invoice.company.address }}</p>
            <p>
              {{ invoice.company.city }} - {{ invoice.company.pin_code }}
              {{ invoice.company.state }}
            </p>
            <p>STATE CODE - {{ invoice.company.state_code }}</p>
            <p>GSTIN - {{ invoice.company.gstin }}</p>
          </div>
        </div>
        <div class="col-sm-6 col-md-6 col-xs-6" style="text-align: right">
          <p>
            <b>Invoice Date :</b>
            {{ formatDate(invoice.date) }}
          </p>
          <p>
            <b>Invoice No. :</b>
            {{ invoice.invoice_number }}
          </p>
        </div>
      </div>
      <br />
      <div class="invoice-intro">
        <span>{{ $route.path.includes('estimate') ? 'ESTIMATE' : 'TAX INVOICE' }}</span>
      </div>
      <br />
      <div class="row">
        <div class="col-sm-4 col-md-4 col-xs-4">
          <p>
            <b>
              {{ $route.path.includes('purchase') ? 'Supplier' : 'Customer' }}
              Name
            </b>
          </p>
          <p>
            {{ !$route.path.includes('purchase') ? invoice.customer.name : invoice.supplier.name }}
          </p>
          <template v-if="!$route.path.includes('purchase')">
            <div v-if="invoice.customer.registered_gst_member">
              <p>
                <b>
                  {{ $route.path.includes('purchase') ? 'Supplier' : 'Customer' }}
                  GSTN
                </b>
              </p>
              <p>{{ invoice.customer.gstin }}</p>
            </div>
          </template>
          <template v-else>
            <div v-if="invoice.supplier.registered_gst_member">
              <p>
                <b>
                  {{ $route.path.includes('purchase') ? 'Supplier' : 'Customer' }}
                  GSTN
                </b>
              </p>
              <p>{{ invoice.supplier.gstin }}</p>
            </div>
          </template>
        </div>
        <template v-if="!$route.path.includes('purchase')">
          <div class="col-sm-4 col-md-4 col-xs-4">
            <p><b>Billing Address</b></p>
            <p>{{ invoice.billing_address }}</p>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-4">
            <p><b>Shipping Address</b></p>
            <p>{{ invoice.shipping_address }}</p>
          </div>
        </template>
        <template v-else>
          <div class="col-sm-4 col-md-4 col-xs-4">
            <p><b>Supplier Address</b></p>
            <p>{{ invoice.supplier.address }}</p>
          </div>
          <div class="col-sm-4 col-md-4 col-xs-4"></div>
        </template>
      </div>
      <hr style="background-color: black; height: 2px" />
      <table>
        <thead>
          <tr class="head">
            <th>Item</th>
            <th>HSN/ SAC</th>
            <th>Quantity</th>
            <th>Rate /Item (₹)</th>
            <th>Amount (₹)</th>
            <th>Discount (₹)</th>
            <th v-if="!$route.path.includes('estimate')">Taxable Value (₹)</th>
            <th v-if="!$route.path.includes('estimate')">CGST (₹)</th>
            <th v-if="!$route.path.includes('estimate')">SGST /UTGST (₹)</th>
            <th>Total(₹)</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="$route.path.includes('bill')">
            <tr v-for="i in invoice.items" :key="i.id">
              <td>{{ i.product.name }}</td>
              <td>{{ i.product.hsn_code }}</td>
              <td>{{ i.quantity }} {{ i.product.unit }}</td>
              <td>{{ i.rate }}</td>
              <td>{{ i.amount }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
          <template v-else-if="$route.path.includes('estimate')">
            <tr v-for="i in invoice.items" :key="i.id">
              <td>{{ i.product.name }}</td>
              <td>{{ i.product.hsn_code }}</td>
              <td>{{ i.quantity }} {{ i.product.unit }}</td>
              <td>{{ i.rate }}</td>
              <td>{{ i.amount }}</td>
              <td></td>
              <td></td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="i in invoice.items" :key="i.id">
              <td>{{ i.product.name }}</td>
              <td>{{ i.product.hsn_code }}</td>
              <td>{{ i.quantity }} {{ i.product.unit }}</td>
              <td>{{ i.rate }}</td>
              <td>{{ i.amount }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
          <tr class="total">
            <td colspan="5"></td>
            <td>{{ invoice.discount }}</td>
            <td v-if="!$route.path.includes('estimate')">
              {{ invoice.taxable_amount }}
            </td>
            <td v-if="!$route.path.includes('estimate')">
              {{ invoice.cgst_value }}
            </td>
            <td v-if="!$route.path.includes('estimate')">
              {{ invoice.sgst_value }}
            </td>
            <td>
              <b>₹ {{ invoice.gross_total }}</b>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <div class="text-center no-print">
        <button @click.prevent="print">
          <u><b>print</b></u>
        </button>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
@media print {
  @page {
    size: auto;
    margin: 0mm;
  }
  .q-py-sm,
  .q-px-md {
    padding: 0 !important;
  }
}
.invoice {
  padding: 15px !important;
  overflow-x: auto;
  width: 21cm;
  font-size: 12px;
  font-family: Arial, sans-serif;
  margin: auto;
  h4,
  h5,
  h3,
  h6 {
    margin-block-start: 0px;
    margin-block-end: 4px;
  }
  table {
    word-wrap: break-word;
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    th {
      &:first-child {
        text-align: left;
      }
      text-align: right;
      padding: 8px 5px;
    }
    td {
      &:first-child {
        text-align: left;
      }
      text-align: right;
      padding: 12px 5px;
    }
    tr {
      border-bottom: 1px solid black;
      &:nth-child(even) {
        background-color: #f2f2f2;
      }
    }
    .head {
      th {
        &:nth-child(1) {
          width: 300px;
        }
      }
    }
    .total {
      td {
        text-align: right;
        &:nth-child(1) {
          text-align: right;
          font-weight: bold;
        }
      }
    }
  }
  .invoice-intro {
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    span {
      &:before {
        vertical-align: middle;
        float: left;
        content: ' ';
        margin: 4px 0 0 0;
        width: 40%;
        padding: 5px;
        border-top: 2px solid $primary-dark;
        border-bottom: 2px solid $primary-dark;
      }
      &:after {
        vertical-align: middle;
        float: right;
        content: ' ';
        margin: 2px 0 0 0;
        width: 40%;
        padding: 5px;
        border-top: 2px solid $primary-dark;
        border-bottom: 2px solid $primary-dark;
      }
    }
  }
}
</style>
