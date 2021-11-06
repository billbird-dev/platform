<script setup lang="ts">
import CustomerBlock from 'components/Bill/CustomerBlock.vue';
import InvoiceRow from 'components/Bill/InvoiceRow.vue';
import { ref, watchEffect } from 'vue';
import { Customer, InvoiceModel, ProductModel } from 'src/types/interfaces';
import { BillColumns } from 'src/utils/constants';
import AppInput from 'components/App/AppInput.vue';
import { randomId, useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';
import { date, QForm, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const { loading } = useQuasar();
const router = useRouter();

const { getAll: CustomergetAll } = useBillBirdApi<Customer>('/customer');
const { getAll: InventorygetAll } = useBillBirdApi<ProductModel>('/inventory');
const { createEntity } = useBillBirdApi<InvoiceModel>('/sale');

const { data: Customers } = useSwr<Customer>('/customer', CustomergetAll);
const { data: Products } = useSwr<ProductModel>('/inventory', InventorygetAll);

const form = ref<QForm | null>(null);
const invoiceData = ref<InvoiceModel>({
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
  billing_address: '',
  shipping_address: '',
  items: [
    {
      id: randomId(),
      quantity: 1,
      amount: 1,
      rate: 0,
    },
  ],
});

function calTotal() {
  invoiceData.value.net_amount = invoiceData.value.items.reduce(
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
}

const removeRow = (index: string): void => {
  invoiceData.value.items.splice(
    invoiceData.value.items.findIndex((el) => el.id === index),
    1,
  );
};

const addRow = (): void => {
  invoiceData.value.items.push({
    id: randomId(),
    quantity: 1,
    amount: 1,
    rate: 0,
  });
};

async function createSaleInvoice() {
  try {
    const res = await form.value?.validate(true);
    if (!res) return useNotify('negative', 'Please fill the required fields !');

    if (!invoiceData.value.customer) return useNotify('negative', 'Please fill customer Data !');

    if (!invoiceData.value.date?.length) return useNotify('negative', 'Please fill invoice Date !');

    if (invoiceData.value.items.some((el) => !el.product))
      return useNotify('negative', 'Please select a product !');

    loading.show();
    const { id } = await createEntity(invoiceData.value);

    router.push(`/invoice/bill/${id}`);
  } catch (error) {
    useNotify('negative', 'Some error occured !');
  } finally {
    loading.hide();
  }
}

watchEffect(calTotal);

watchEffect(() => {
  if (invoiceData.value.items.length < 1) {
    useNotify('negative', "Items can't be empty !");
    addRow();
  }
});

interface CustomerPayload {
  customer?: number;
  billing_address?: string;
  shipping_address?: string;
}

function selectCustomer(payload: CustomerPayload) {
  invoiceData.value = {
    ...invoiceData.value,
    customer: payload.customer,
    shipping_address: payload.shipping_address,
    billing_address: payload.billing_address,
  };
}

function setDate(date: string) {
  invoiceData.value.date = date;
}
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <p class="text-h4 q-pt-md q-pb-lg page-header">
      <b>New Tax Invoice</b>
    </p>
    <customer-block
      :date="invoiceData.date"
      :customers="Customers || []"
      @selected:customer="selectCustomer"
      @selected:date="setDate"
    />
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
              v-for="(row, index) in invoiceData.items"
              :key="row.id"
              :index="index"
              :row-data="row"
              @remove-row="removeRow($event)"
              @add-row="addRow"
              :product-list="Products"
            />
          </tbody>
        </table>
      </div>

      <div class="q-my-md">
        <q-btn round unelevated size="md" color="primary" @click="addRow">
          <q-icon name="las la-plus-circle" color="black" size="sm" />
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
