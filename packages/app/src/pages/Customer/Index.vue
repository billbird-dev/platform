<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { CustomerTableColumns } from 'src/utils/constants';
import { CustomerBlock } from 'src/types/interfaces';
import { useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';
import { useQuasar } from 'quasar';
import customerDialog from 'src/components/Customer/CustomerModal.vue';

const initialPagination = {
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 20,
};

const { loading } = useQuasar();
const { createEntity, getAll, updateEntity, removeEntity } =
  useBillBirdApi<CustomerBlock>('/sale/customer/');
const { data, mutate, isValidating } = useSwr<CustomerBlock>('/sale/customer/', getAll);

const customerModal = ref(false);
const newCustomer = ref<CustomerBlock>({ registered_gst_member: false });
const isEditMode = ref(false);
const filter = ref('');

function editMode(id: string) {
  newCustomer.value = {
    ...(data.value as CustomerBlock[]).find((el) => el.id === id),
  } as CustomerBlock;

  isEditMode.value = true;
  customerModal.value = true;
}

watchEffect(() => {
  if (isValidating.value) return loading.show();

  if (!isValidating.value) return loading.hide();
});

async function createCustomer() {
  loading.show();

  try {
    await createEntity(newCustomer.value);
    customerModal.value = false;

    useNotify('positive', 'Customer  created successfully !');
    await mutate();
  } catch (error) {
    console.log(error as any);

    useNotify('negative', (error as any).response.statusText);
  } finally {
    loading.hide();
  }
}

async function updateCustomer() {
  loading.show();

  try {
    await updateEntity(newCustomer.value, newCustomer.value?.id);
    customerModal.value = false;
    isEditMode.value = false;

    useNotify('positive', 'Customer  updated successfully !');
    await mutate();
  } catch (error) {
    console.log(error as any);

    useNotify('negative', (error as any).response.statusText);
  } finally {
    loading.hide();
  }
}

async function removeCustomer(id: string) {
  loading.show();

  try {
    await removeEntity(id);

    useNotify('positive', 'Customer removed successfully !');
    await mutate();
  } catch (error) {
    console.log(error);

    useNotify('negative', (error as any).response.statusText);
  } finally {
    loading.hide();

    isEditMode.value = false;
    newCustomer.value = { registered_gst_member: false };
    customerModal.value = false;
  }
}

watchEffect(() => {
  if (!newCustomer.value.registered_gst_member) {
    newCustomer.value.gstin = '';
  }
});
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <customer-dialog
      v-model:customer-modal="customerModal"
      :newCustomer="newCustomer"
      :isEditMode="isEditMode"
      v-model:customer-billing="newCustomer.billing_address"
      v-model:customer-shipping="newCustomer.shipping_address"
      v-model:customer-isgst="newCustomer.registered_gst_member"
      v-model:customer-gstin="newCustomer.gstin"
      v-model:customer-name="newCustomer.name"
      v-model:customer-email="newCustomer.email"
      v-model:customer-phone="newCustomer.phone"
      @removeCustomer="removeCustomer($event)"
      @createCustomer="createCustomer"
      @reset="(newCustomer = { registered_gst_member: false }), (isEditMode = false)"
      @updateCustomer="updateCustomer"
    />

    <div class="q-pt-md q-pb-lg">
      <div>
        <span class="text-h4 page-header">
          <b>Customers</b>
        </span>
        <div class="float-right">
          <q-btn
            label="Add"
            no-caps
            color="primary"
            unelevated
            text-color="black"
            @click="customerModal = !customerModal"
          ></q-btn>
        </div>
      </div>
    </div>
    <div>
      <q-table
        :table-header-style="{ backgroundColor: 'primary' }"
        flat
        :columns="CustomerTableColumns"
        row-key="name"
        :filter="filter"
        :rows="data"
        :dense="$q.screen.width < 700"
        :pagination="initialPagination"
        :loading="isValidating"
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
            placeholder="Search customer"
          >
            <template v-slot:append>
              <q-icon name="search" color="dark" />
            </template>
          </q-input>
        </template>
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-primary">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width />
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" @click="editMode(props.row.id)" style="cursor: pointer">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="props.row[col.name]">
                {{ props.row[col.name] }}
              </template>
              <template v-else>N/A</template>
            </q-td>
            <q-td auto-width class="q-gutter-x-xs">
              <q-btn
                size="sm"
                text-color="dark"
                color="primary"
                unelevated
                round
                dense
                icon="las la-pen"
                @click="editMode(props.row.id)"
              />
              <!-- <q-btn
                size="sm"
                color="negative"
                unelevated
                round
                dense
                icon="las la-trash"
                @click="removeCustomer(props.row.id)"
              /> -->
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
