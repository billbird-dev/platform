<script setup lang="ts">
import { date, QForm, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ref, watchEffect } from 'vue';

import CustomerBlock from 'components/Bill/CustomerBlock.vue';
import InvoiceRow from 'components/Bill/InvoiceRow.vue';
import {
  CustomerBlock as CustomerModel,
  EstimateModel,
  InvoiceItem,
  ProductModel,
} from 'src/types/interfaces';
import { BillColumns } from 'src/utils/constants';
import AppInput from 'components/App/AppInput.vue';
import { useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';

const router = useRouter();
const { loading } = useQuasar();
const { getAll: CustomerGetAll } = useBillBirdApi<CustomerModel>('/sale/customer/');
const { getAll: InventoryGetAll } = useBillBirdApi<ProductModel>('/inventory/');
const { createEntity } = useBillBirdApi<EstimateModel>('/sale/estimate/');

const { data: Customers } = useSwr<CustomerModel>('/sale/customer', CustomerGetAll);
const { data: Products } = useSwr<ProductModel>('/inventory/', InventoryGetAll);

const form = ref<null | QForm>(null);
const estimateData = ref<EstimateModel>({
  invoice_number: Math.random().toString(36).substring(7).toUpperCase(),
  discount: 0,
  discount_percent: 0,
  net_amount: 0,
  gross_total: 0,
  date: date.formatDate(new Date(), 'YYYY-MM-DD'),
  customer: '',
  billing_address: '',
  shipping_address: '',
  estimate_item: [
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
  estimateData.value.net_amount = (estimateData.value.estimate_item as InvoiceItem[]).reduce(
    (acc, val) => acc + (val as any).amount,
    0,
  );

  if (estimateData.value.discount_percent !== 0) {
    estimateData.value.discount =
      ((estimateData.value.discount_percent as number) / 100) * estimateData.value.net_amount;
    estimateData.value.discount = parseFloat(
      (Math.floor(estimateData.value.discount * 100) / 100).toFixed(2),
    );
  }
  estimateData.value.net_amount -
    parseFloat((Math.floor((estimateData.value.discount as number) * 100) / 100).toFixed(2));
  estimateData.value.gross_total =
    estimateData.value.net_amount -
    parseFloat((Math.floor((estimateData.value.discount as number) * 100) / 100).toFixed(2));
  Math.floor((estimateData.value.gross_total as number) * 100) / 100;
  (estimateData.value.gross_total as number).toFixed(2);
};

const removeRow = (index: string): void => {
  estimateData.value.estimate_item?.splice(
    estimateData.value.estimate_item?.findIndex((el) => el.serial === index),
    1,
  );
};

const addRow = (): void => {
  estimateData.value.estimate_item?.push({
    serial: Math.random().toString(36).substring(7),
    product: '',
    rate: 0,
    quantity: 1,
    amount: 1,
  });
};

async function createEstimate() {
  try {
    const res = await form.value?.validate(true);
    if (!res) return useNotify('negative', 'Please fill the required fields !');

    if (!estimateData.value.customer?.length)
      return useNotify('negative', 'Please fill customer Data !');

    if (!estimateData.value.date?.length)
      return useNotify('negative', 'Please fill estimate Date !');

    if (estimateData.value.estimate_item?.some((el) => !el.product?.length))
      return useNotify('negative', 'Please select a product !');

    loading.show();

    const { id } = await createEntity(estimateData.value);

    router.push(`/invoice/estimate/${id}/`);
  } catch (error) {
    console.log(error);
    useNotify('negative', 'Some error occured!');
  } finally {
    loading.hide();
  }
}

watchEffect(() => {
  calTotal();
});

watchEffect(() => {
  if ((estimateData.value.estimate_item as InvoiceItem[]).length < 1) {
    useNotify('negative', "Items can't be empty !");
    addRow();
  }
});
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <p class="text-h4 q-pt-md q-pb-lg page-header">
      <b>New Estimate</b>
    </p>
    <customer-block :invoice-data="estimateData" :date="estimateData.date" :Customers="Customers" />
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
              v-for="(row, index) in estimateData.estimate_item"
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
      <q-btn round unelevated size="md" color="primary" @click="addRow">
        <q-icon name="las la-plus-circle" color="black" size="sm"></q-icon>
      </q-btn>
      <br />
      <br />

      <div class="row q-col-gutter-sm">
        <div class="col-sm-3 col-md-3 col-xs-12"></div>
        <div class="col-sm-3 col-md-3 col-xs-12">
          <app-input
            :min="0"
            type="number"
            v-model.number="estimateData.discount_percent"
            :required="false"
            name="Discount Percent"
            label="Discount %"
          />
        </div>
        <div class="col-sm-3 col-md-3 col-xs-12">
          <app-input
            type="number"
            :min="0"
            v-model.number="estimateData.discount"
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
            v-model.number="estimateData.net_amount"
          />

          <div class="row q-col-gutter-sm">
            <div class="col-xs-4"></div>
            <div class="col-xs-4"></div>
            <div class="col-xs-4"></div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col">
              <!-- <app-input
                type="number"
                :min="0"
                required
                name="Payment"
                label="Payment"
                v-model="estimateData."
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
                v-model.number="estimateData.gross_total"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-right">
        <q-btn
          label="Submit"
          @click="createEstimate"
          unelevated
          color="primary"
          text-color="dark"
          no-caps
        />
      </div>
    </q-form>
  </q-page>
</template>
