<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { CustomerTableColumns } from 'src/utils/constants';
import { SupplierModel } from 'src/types/interfaces';
import { useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';
import { useQuasar } from 'quasar';
import AppInput from 'components/App/AppInput.vue';
import AppDeleteButton from 'components/App/AppDeleteButton.vue';

const initialPagination = {
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 20,
};

const { loading } = useQuasar();
const SupplierApi = useBillBirdApi<SupplierModel>('/purchase/supplier/');
const { data: Suppliers, mutate, isValidating } = useSwr('/purchase/supplier', getSuppliers);

const form = ref<null | any>(null);
const supplierModal = ref(false);
const filter = ref('');
const isEditMode = ref(false);
const newSupplier = ref<SupplierModel>({ registered_gst_member: false });

function editMode(id: string) {
  newSupplier.value = {
    ...(Suppliers.value as SupplierModel[]).find((el) => el.id === id),
  } as SupplierModel;
  isEditMode.value = true;
  supplierModal.value = true;
}

async function getSuppliers() {
  loading.show();
  return await SupplierApi.getAll().finally(() => loading.hide());
}

async function createSupplier() {
  await form.value.validate().then(async (success: boolean) => {
    if (success) {
      loading.show();
      await SupplierApi.createEntity(newSupplier.value)
        .then(async () => {
          loading.hide();
          supplierModal.value = false;
          await mutate();
          useNotify('positive', 'Supplier  created successfully !');
        })
        .catch((err) => {
          loading.hide();
          console.log(err);
          useNotify('negative', err.response.statusText);
        });
    } else {
      useNotify('negative', 'Please fill the required fields !');
    }
  });
}

async function updateSupplier() {
  await form.value.validate().then(async (success: boolean) => {
    if (success) {
      loading.show();
      await SupplierApi.updateEntity(newSupplier.value, newSupplier.value?.id)
        .then(async () => {
          loading.hide();
          supplierModal.value = false;
          isEditMode.value = false;
          await mutate();
          useNotify('positive', 'Supplier  updated successfully !');
        })
        .catch((err) => {
          loading.hide();
          console.log(err);
          useNotify('negative', err.response.statusText);
        });
    } else {
      useNotify('negative', 'Please fill the required fields !');
    }
  });
}

async function removeSupplier(id: string) {
  loading.show();
  await SupplierApi.removeEntity(id)
    .then(async () => {
      loading.hide();
      await mutate();
      useNotify('positive', 'Supplier removed successfully !');
    })
    .catch((err) => {
      loading.hide();
      useNotify('negative', err.response.statusText);
    })
    .finally(() => {
      isEditMode.value = false;
      newSupplier.value = { registered_gst_member: false };
      supplierModal.value = false;
    });
}

watchEffect(() => {
  if (!newSupplier.value.registered_gst_member) {
    newSupplier.value.gstin = '';
  }
});
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <q-dialog
      v-model="supplierModal"
      @hide="(newSupplier = { registered_gst_member: false }), (isEditMode = false)"
    >
      <q-card style="width: 700px; max-width: 700px" class="bg q-pb-sm">
        <q-form @submit.prevent="isEditMode ? updateSupplier() : createSupplier()" ref="form">
          <q-card-section>
            <span class="text-h5" v-if="!isEditMode"> Add a new Supplier </span>
            <span class="text-h5" v-else> Editing {{ newSupplier.name }} </span>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md">
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.name"
                  name="Supplier name"
                  required
                  label-from-name
                ></app-input>
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.email"
                  name="Supplier E-mail"
                  required
                  label-from-name
                  type="email"
                ></app-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md">
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.phone"
                  name="Supplier phone"
                  required
                  label-from-name
                  mobileNum
                  :lazyRules="false"
                ></app-input>
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.address"
                  name="Supplier address"
                  required
                  label-from-name
                  type="textarea"
                  autogrow
                ></app-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md items-start">
              <div class="col-sm-6 col-xs-12">
                <q-checkbox
                  label="Registered GST member"
                  v-model="newSupplier.registered_gst_member"
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.gstin"
                  name="Supplier GST number"
                  label-from-name
                  :disable="!newSupplier.registered_gst_member"
                  :required="false"
                ></app-input>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-gutter-x-md q-px-md">
            <app-delete-button v-if="isEditMode" @remove="removeSupplier(newSupplier.id)" />
            <q-btn
              :label="isEditMode ? 'Update' : 'Submit'"
              no-caps
              color="primary"
              unelevated
              text-color="black"
              type="submit"
            ></q-btn>
            <q-btn label="Cancel" no-caps color="negative" unelevated outline v-close-popup></q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <div class="q-pt-md q-pb-lg">
      <div>
        <span class="text-h4 page-header">
          <b>Suppliers</b>
        </span>
        <div class="float-right">
          <q-btn
            label="Add"
            no-caps
            color="primary"
            unelevated
            text-color="black"
            @click="supplierModal = !supplierModal"
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
        :rows="Suppliers"
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
            placeholder="Search supplier"
            hint="Seach by name, phone number, address etc.."
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
              <template v-else>N/A </template>
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
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
