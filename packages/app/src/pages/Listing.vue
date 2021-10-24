<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

import { InvoiceListingColumns, PurchaseListingColumns } from 'src/utils/constants';
import { firstCapitalize, useBillBirdApi, useNotify } from 'src/utils/helpers';

const initialPagination = {
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 20,
};

const route = useRoute();
const { loading } = useQuasar();

const BillApi = useBillBirdApi('/sale/bill/');
const PurchaseApi = useBillBirdApi('/purchase/purchase/');
const EstimateApi = useBillBirdApi<any>('/sale/estimate/');

const state = ref<any[]>();
const filter = ref('');
const isLoading = ref(false);

watchEffect(() => {
  if (isLoading.value) return loading.show();
  if (!isLoading.value) return loading.hide();
});

onMounted(async () => {
  if (route.path === '/bill/all') return await getInvoice();
  if (route.path === '/estimate/all') return await getEstimate();
  if (route.path === '/purchase/all') return await getPurchase();
});

async function getInvoice() {
  isLoading.value = true;

  try {
    const data = await BillApi.getAll();
    state.value = data;
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
    const data = await EstimateApi.getAll();
    state.value = data;
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
    const data = await PurchaseApi.getAll();
    state.value = data;
  } catch (error) {
    console.log(error);
    useNotify('negative', 'Failed to fetch purchase !');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <p class="text-h4 q-pt-md q-pb-lg page-header">
      <b>
        {{
          firstCapitalize(
            $route.path.split('/')[1] === 'bill' ? 'invoice' : $route.path.split('/')[1],
          )
        }}
        Listing
      </b>
    </p>

    <div>
      <q-table
        :table-header-style="{ backgroundColor: 'primary' }"
        flat
        :columns="
          ['bill', 'estimate'].includes($route.path.split('/')[1])
            ? InvoiceListingColumns
            : PurchaseListingColumns
        "
        row-key="name"
        :filter="filter"
        :rows="state"
        :dense="$q.screen.width < 700"
        :pagination="initialPagination"
      >
        <template v-slot:top>
          <q-space />
          <q-input
            :class="{ 'full-width': $q.screen.width < 700 }"
            standout
            dense
            debounce="300"
            color="primary"
            v-model="filter"
            :placeholder="`Search all ${$route.path.split('/')[1]}s`"
            hint="Search by invoice no., date, customer or supplier name."
          >
            <template v-slot:append>
              <q-icon name="search" color="dark" />
            </template>
          </q-input>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-primary" no-hover>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width></q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" no-hover>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'supplier' || col.name === 'customer'">
                {{ props.row[col.name].name }}
              </template>
              <template v-else>
                {{ props.row[col.name] ? props.row[col.name] : 'N/A' }}
              </template>
            </q-td>
            <q-td title="Print invoice">
              <router-link
                :to="
                  $route.path.includes('bill')
                    ? `/invoice/bill/${props.row.id}`
                    : $route.path.includes('estimate')
                    ? `/invoice/estimate/${props.row.id}`
                    : `/invoice/purchase/${props.row.id}`
                "
              >
                <q-icon size="sm" name="las la-print"></q-icon>
              </router-link>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
