<script setup lang="ts">
import CustomerBlock from 'components/Bill/CustomerBlock.vue';
import InvoiceRow from 'components/Bill/InvoiceRow.vue';
import { ref, watchEffect } from 'vue';
import {
  CustomerBlock as CustomerModel,
  InvoiceItem,
  InvoiceModel,
  ProductModel,
} from 'src/types/interfaces';
import { BillColumns } from 'src/utils/constants';

import AppInput from 'components/App/AppInput.vue';
import { useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';
import { date, QForm, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const { loading } = useQuasar();
const router = useRouter();
const { getAll: CustomergetAll } = useBillBirdApi<CustomerModel>('/sale/customer/');
const { getAll: InventorygetAll } = useBillBirdApi<ProductModel>('/inventory/');
const { createEntity } = useBillBirdApi<ProductModel>('/sale/bill/');

const { data: Customers } = useSwr<CustomerModel>('/sale/customer', CustomergetAll);
const { data: Products } = useSwr<ProductModel>('/inventory/', InventorygetAll);

const form = ref<null | QForm>(null);
const invoiceData = ref<InvoiceModel>({
  invoice_number: Math.random().toString(36).substring(7).toUpperCase(),
  igst_percent: 0,
  cgst_value: 0,
  sgst_value: 0,
  igst_value: 0,
  cgst_percent: 0,
  sgst_percent: 0,
  discount: 0,
  discount_percent: 0,
  net_amount: 0,
  taxable_amount: 0,
  gross_total: 0,
  date: date.formatDate(new Date(), 'YYYY-MM-DD'),
  customer_id: '',
  billing_address: '',
  shipping_address: '',
  sale_item: [
    {
      serial: 'b3jb',
      product: '',
      rate: 0,
      quantity: 1,
      amount: 1,
    },
  ],
});

const calTotal = () => {
  invoiceData.value.net_amount = (invoiceData.value.sale_item as InvoiceItem[]).reduce(
    (acc, val) => acc + (val as any).amount,
    0,
  );
  if (invoiceData.value.igst_percent !== 0) {
    invoiceData.value.sgst_percent = 0;
    invoiceData.value.cgst_percent = 0;
  }
  if (invoiceData.value.discount_percent !== 0) {
    invoiceData.value.discount =
      ((invoiceData.value.discount_percent as number) / 100) * invoiceData.value.net_amount;
    invoiceData.value.discount = parseFloat(
      (Math.floor(invoiceData.value.discount * 100) / 100).toFixed(2),
    );
  }
  invoiceData.value.taxable_amount =
    invoiceData.value.net_amount -
    parseFloat((Math.floor((invoiceData.value.discount as number) * 100) / 100).toFixed(2));
  invoiceData.value.sgst_value =
    ((invoiceData.value.sgst_percent as number) / 100) * invoiceData.value.taxable_amount;
  invoiceData.value.cgst_value =
    ((invoiceData.value.cgst_percent as number) / 100) * invoiceData.value.taxable_amount;
  invoiceData.value.igst_value =
    ((invoiceData.value.igst_percent as number) / 100) * invoiceData.value.taxable_amount;
  invoiceData.value.igst_value = parseFloat(
    (Math.floor(invoiceData.value.igst_value * 100) / 100).toFixed(2),
  );
  invoiceData.value.cgst_value = parseFloat(
    (Math.floor(invoiceData.value.cgst_value * 100) / 100).toFixed(2),
  );
  invoiceData.value.sgst_value = parseFloat(
    (Math.floor(invoiceData.value.sgst_value * 100) / 100).toFixed(2),
  );
  invoiceData.value.gross_total =
    invoiceData.value.taxable_amount +
    invoiceData.value.cgst_value +
    invoiceData.value.sgst_value +
    invoiceData.value.igst_value;
  invoiceData.value.gross_total = Math.floor(invoiceData.value.gross_total * 100) / 100;
  invoiceData.value.gross_total.toFixed(2);
};

const removeRow = (index: string): void => {
  invoiceData.value.sale_item?.splice(
    invoiceData.value.sale_item?.findIndex((el) => el.serial === index),
    1,
  );
};

const addRow = (): void => {
  invoiceData.value.sale_item?.push({
    serial: Math.random().toString(36).substring(7),
    product: '',
    rate: 0,
    quantity: 1,
    amount: 1,
  });
};

async function createSaleInvoice() {
  try {
    const res = await form.value?.validate(true);
    if (!res) return useNotify('negative', 'Please fill the required fields !');

    if (!invoiceData.value.customer_id?.length)
      return useNotify('negative', 'Please fill customer Data !');

    if (!invoiceData.value.date?.length) return useNotify('negative', 'Please fill invoice Date !');

    if (invoiceData.value.sale_item?.some((el) => !el.product?.length))
      return useNotify('negative', 'Please select a product !');

    loading.show();
    const { id } = await createEntity(invoiceData.value);

    router.push(`/invoice/bill/${id}`);
  } catch (error) {
    console.log(JSON.parse(JSON.stringify(error as any)));
    useNotify('negative', 'Some error occured !');
  } finally {
    loading.hide();
  }
}

watchEffect(() => {
  calTotal();
});

watchEffect(() => {
  if ((invoiceData.value.sale_item as InvoiceItem[]).length < 1) {
    useNotify('negative', "Items can't be empty !");
    addRow();
  }
});
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <p class="text-h4 q-pt-md q-pb-lg page-header">
      <b>New Tax Invoice</b>
    </p>
    <customer-block :invoiceData="invoiceData" :date="invoiceData.date" :Customers="Customers" />
    <q-form ref="form" greedy>
      <div class="b-table">
        <table class="b-table__native">
          <thead>
            <tr>
              <th class="b-table__th" v-for="column in BillColumns" :key="column">
                {{ column }}
              </th>
              <th class="b-table__th"></th>
            </tr>
          </thead>
          <tbody>
            <invoice-row
              v-for="(row, index) in invoiceData.sale_item"
              :key="row.serial"
              :index="index"
              :rowData="row"
              @remove-row="removeRow($event)"
              @add-row="addRow"
              :productList="Products"
            />
          </tbody>
        </table>
      </div>

      <div class="q-my-md">
        <q-btn round unelevated size="md" color="primary" @click="addRow">
          <q-icon name="las la-plus-circle" color="black" size="sm"></q-icon>
        </q-btn>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-sm-3 col-md-3 col-xs-12">
          <app-input
            type="number"
            :min="0"
            v-model.number="invoiceData.igst_percent"
            name="IGST Percent"
            label="IGST Percent"
            :required="false"
          />
        </div>
        <div class="col-sm-3 col-md-3 col-xs-12">
          <app-input
            :min="0"
            type="number"
            v-model.number="invoiceData.sgst_percent"
            :required="false"
            name="SGST Percent"
            label="SGST %"
          />

          <app-input
            :min="0"
            type="number"
            v-model.number="invoiceData.discount_percent"
            :required="false"
            name="Discount Percent"
            label="Discount %"
          />
        </div>
        <div class="col-sm-3 col-md-3 col-xs-12">
          <app-input
            type="number"
            :min="0"
            v-model.number="invoiceData.cgst_percent"
            :required="false"
            name="CGST Percent"
            label="CGST %"
          />

          <app-input
            type="number"
            :min="0"
            v-model.number="invoiceData.discount"
            :required="false"
            name="Discount"
            label="Discount"
          />
        </div>
        <div class="col-sm-3 col-md-3 col-xs-12">
          <app-input
            type="number"
            :min="0"
            readonly
            :required="false"
            name="Sub Total"
            label="Sub Total"
            v-model.number="invoiceData.net_amount"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-xs-4">
              <app-input
                type="number"
                :min="0"
                readonly
                :required="false"
                name="SGST"
                label="SGST"
                v-model.number="invoiceData.sgst_value"
              />
            </div>
            <div class="col-xs-4">
              <app-input
                type="number"
                :min="0"
                readonly
                v-model.number="invoiceData.cgst_value"
                :required="false"
                name="CGST"
                label="CGST"
              />
            </div>
            <div class="col-xs-4">
              <app-input
                type="number"
                :min="0"
                readonly
                v-model.number="invoiceData.igst_value"
                :required="false"
                name="IGST"
                label="IGST"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col">
              <!-- <app-input
                type="number"
                :min="0"
                required
                name="Payment"
                label="Payment"
                v-model="invoiceData."
              />
            </div>
            <div class="col-xs-6"> -->
              <app-input
                type="number"
                :min="0"
                readonly
                :required="false"
                name="Total"
                label="Total"
                v-model.number="invoiceData.gross_total"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-right">
        <q-btn
          label="Submit"
          @click="createSaleInvoice"
          unelevated
          color="primary"
          text-color="dark"
          no-caps
        />
      </div>
    </q-form>
  </q-page>
</template>
