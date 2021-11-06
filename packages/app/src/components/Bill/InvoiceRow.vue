<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { InvoiceItem, ProductModel } from 'src/types/interfaces';
import AppInput from 'components/App/AppInput.vue';

defineEmits(['remove-row', 'add-row']);

const props = withDefaults(
  defineProps<{
    rowData: any;
    index: number;
    productList: ProductModel[];
  }>(),
  { productList: () => [] },
);

const row = ref<InvoiceItem>(props.rowData);
const products = ref(props.productList);

function setProduct(e: number) {
  const watchData = products.value.find((el) => el.id === e);
  if (!watchData) return;

  row.value.product = { ...watchData };
  row.value.rate = watchData.rate;
}

const calAmount = () => {
  if (!row.value.product || row.value.product.rate === 0) {
    row.value.amount = 0;
  } else {
    const val = row.value.rate * row.value.quantity;
    row.value.amount = val;
  }
};

watchEffect(calAmount);

function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();

    products.value = props.productList
      .slice()
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
        :model-value="row.product?.name"
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
        @update:model-value="setProduct"
      />
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
        :disable="!row.product?.name"
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
        :disable="!row.product?.name"
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
      <q-btn round unelevated flat size="md" color="negative" @click="$emit('remove-row', row.id)">
        <q-icon name="las la-trash-alt" color="negative" size="sm"></q-icon>
      </q-btn>
    </td>
  </tr>
</template>
