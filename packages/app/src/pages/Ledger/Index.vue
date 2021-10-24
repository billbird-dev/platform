<script setup lang="ts">
import { watchEffect } from 'vue';
import { useQuasar } from 'quasar';

import { LedgerTableColumns } from 'src/utils/constants';
import { LedgerModel } from 'src/types/interfaces';
import { useBillBirdApi, useSwr } from 'src/utils/helpers';

const initialPagination = {
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 20,
};

const { loading } = useQuasar();

const { getAll } = useBillBirdApi<LedgerModel>('/transactions/');
const { data: Ledger, isValidating } = useSwr('/transactions/', getAll);

watchEffect(() => {
  if (isValidating.value) return loading.show();

  if (!isValidating.value) return loading.hide();
});
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <p class="text-h4 q-pt-md q-pb-lg page-header">
      <b>Ledger</b>
    </p>
    <q-table
      :table-header-style="{ backgroundColor: 'primary' }"
      flat
      :columns="LedgerTableColumns"
      row-key="name"
      :rows="Ledger"
      :dense="$q.screen.width < 700"
      :pagination="initialPagination"
      :loading="isValidating"
    >
      <template v-slot:header="props">
        <q-tr :props="props" class="bg-primary">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width></q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'type'">
              {{ props.row.sale_bill ? 'Sale' : 'Purchase' }}
            </template>
            <template v-else-if="col.name === 'no'">
              {{
                props.row.purchase_bill
                  ? props.row.purchase_bill.invoice_number
                  : props.row.sale_bill.invoice_number
              }}
            </template>
            <template v-else-if="col.name === 'credit' || col.name === 'debit'">
              ₹ {{ props.row[col.name] }}
            </template>
            <template v-else>
              <template v-if="props.row[col.name]">
                {{ props.row[col.name] }}
              </template>
            </template>
          </q-td>
          <q-td auto-width>
            <router-link
              :to="
                props.row.purchase_bill
                  ? `/invoice/purchase/${props.row.purchase_bill.id}`
                  : `/invoice/bill/${props.row.sale_bill.id}`
              "
            >
              <q-icon size="sm" name="las la-print"></q-icon>
            </router-link>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
