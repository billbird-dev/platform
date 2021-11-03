<script setup lang="ts">
import { ref } from 'vue';
import AppInput from 'components/App/AppInput.vue';

interface CustomerPayload {
  customer?: number;
  billing_address?: string;
  shipping_address?: string;
}

const props = withDefaults(
  defineProps<{
    date: string;
    customers: any[];
  }>(),
  {
    customers: () => [],
  },
);

const customerList = ref(props.customers);
const customer = ref<Record<string, any>>({});
const qDateProxy = ref<any>();

function setCustomer(e: number) {
  const watchData = customerList.value.find((el) => el.id === e);

  if (!watchData) return (customer.value.name = e);

  emits('selected:customer', {
    customer: watchData.id,
    billing_address: watchData.billing_address || '',
    shipping_address: watchData.shipping_address || '',
  });

  customer.value = { ...watchData };
}

function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();

    customerList.value = props.customers
      ?.slice()
      .filter(
        (v: any) =>
          (v.name as string).toLowerCase().indexOf(needle) > -1 ||
          (v.phone as number).toString().indexOf(needle) > -1,
      );
  });
}

const emits = defineEmits<{
  (e: 'selected:customer', payload: CustomerPayload): void;
  (e: 'selected:date', date: string): void;
}>();

const setectedDate = (date: any) => {
  emits('selected:date', date);
  qDateProxy.value.hide();
};
</script>

<template>
  <div>
    <div class="row q-col-gutter-x-sm">
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-gutter-y-xs">
        <span class="q-mb-sm">
          {{ !['/purchase'].includes($route.path) ? 'Customer' : 'Supplier' }} details
        </span>

        <q-select
          input-class="text-dark"
          label-color="black"
          color="black"
          standout
          dense
          :model-value="customer.name"
          :label="['/purchase'].includes($route.path) ? 'Select supplier' : 'Select Customer'"
          :options="customerList"
          popup-content-class="bg"
          hide-bottom-space
          hide-dropdown-icon
          :option-label="(item) => (item && item.id ? `${item.name} -- (${item.phone})` : item)"
          option-value="id"
          class="q-pb-sm"
          emit-value
          @filter="filterFn"
          use-input
          :input-debounce="100"
          hint="Search by name, mobile number etc.."
          @update:model-value="setCustomer"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>
        <app-input
          name=" Customer Contact"
          placeholder="Contact"
          mobileNum
          required
          v-model="customer.phone"
          readonly
        />
        <app-input
          name=" Customer Billing address"
          placeholder="Billing address"
          type="textarea"
          autogrow
          required
          v-model="customer.billing_address"
          readonly
          v-if="['/bill', '/estimate'].includes($route.path)"
        />
        <app-input
          name=" Customer Shipping address"
          placeholder="Shipping address"
          type="textarea"
          autogrow
          required
          v-model="customer.shipping_address"
          readonly
          v-if="['/bill', '/estimate'].includes($route.path)"
        />
        <app-input
          name=" Supplier address"
          placeholder=" Address"
          type="textarea"
          autogrow
          required
          v-model="customer.address"
          readonly
          v-if="['/purchase'].includes($route.path)"
        />
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4"></div>
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-gutter-y-xs">
        <span class="q-mb-sm">Date of invoice</span>
        <q-input
          :model-value="date"
          standout
          lazy-rules
          dense
          no-error-icon
          @click="qDateProxy.show()"
          readonly
          hint="*required"
          :rules="['date']"
        >
          <template #append>
            <q-icon name="las la-calendar" color="dark" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date
                  :model-value="date"
                  @update:model-value="setectedDate"
                  today-btn
                  color="primary"
                  text-color="black"
                  mask="YYYY-MM-DD"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>
