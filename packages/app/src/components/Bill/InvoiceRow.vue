<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import { InvoiceItem, ProductModel } from 'src/types/interfaces';
import AppInput from 'components/App/AppInput.vue';

defineEmits(['remove-row', 'add-row']);

const props = defineProps<{
  rowData: any;
  index: number;
  productList?: ProductModel[];
}>();

const row = ref<InvoiceItem>(props.rowData);
const products = ref(props.productList);

function setProduct(e: string) {
  const watchData = products.value?.find((el) => el.id === e);
  if (watchData) {
    row.value.product = watchData.id;
    row.value.name = watchData.name;
    row.value.rate = watchData.rate;
  } else {
    row.value.name = e;
  }
}

const calAmount = () => {
  if (row.value.rate === 0) {
    row.value.amount = 0;
  } else {
    const val = (row.value.rate as number) * (row.value.quantity as number);
    row.value.amount = val;
  }
};

watchEffect(() => calAmount());

function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    products.value = props.productList
      ?.slice()
      .filter((v) => (v.name as string).toLowerCase().indexOf(needle) > -1);
  });
}
</script>

<template>
  <tr>
    <td class="b-table__td">{{ index + 1 }}.</td>
    <td class="b-table__td">
      <q-select
        input-class="text-dark"
        label-color="black"
        color="black"
        standout
        dense
        :model-value="row.name"
        use-input
        :input-debounce="100"
        label="Select Product"
        :options="products"
        @filter="filterFn"
        popup-content-class="bg"
        hide-bottom-space
        hide-dropdown-icon
        :option-label="(item) => (item && item.id ? `${item.name}` : item)"
        option-value="id"
        emit-value
        @update:modelValue="setProduct"
      ></q-select>
    </td>
    <td class="b-table__td">
      <app-input
        class="b-table__td--input"
        dense
        name="rate"
        required
        v-model.number="row.rate"
        type="number"
        :min="0"
        :no-error-icon="$q.screen.width > 450"
        :disable="!row.name"
      />
    </td>
    <td class="b-table__td">
      <app-input
        class="b-table__td--input"
        dense
        name="quantity"
        required
        v-model.number="row.quantity"
        type="number"
        :no-error-icon="$q.screen.width > 450"
        @tab="$emit('add-row')"
        :min="1"
        :disable="!row.name"
      />
    </td>
    <td class="b-table__td">
      <app-input
        type="number"
        class="b-table__td--input"
        dense
        name="amount"
        required
        v-model="row.amount"
        :no-error-icon="$q.screen.width > 450"
        disable
      />
    </td>
    <td class="del" title="Delete Row">
      <q-btn
        round
        unelevated
        flat
        size="md"
        color="negative"
        @click="$emit('remove-row', row.serial)"
      >
        <q-icon name="las la-trash-alt" color="negative" size="sm"></q-icon>
      </q-btn>
    </td>
  </tr>
</template>
