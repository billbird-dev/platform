<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { CustomerTableColumns } from 'src/utils/constants';
import { SupplierModel } from 'src/types/interfaces';
import { getDiff, useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';
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
const { getAll, createEntity, updateEntity, removeEntity } =
  useBillBirdApi<SupplierModel>('/supplier');
const { data: Suppliers, mutate, isValidating } = useSwr<SupplierModel>('/supplier', getAll);

const form = ref<null | any>(null);
const supplierModal = ref(false);
const filter = ref('');
const isEditMode = ref(false);
const newSupplier = ref<SupplierModel>({
  email: '',
  gstin: '',
  name: '',
  registered_gst_member: false,
});

const resetSupplier = () =>
  (newSupplier.value = {
    email: '',
    gstin: '',
    name: '',
    registered_gst_member: false,
  });

function editMode(id: number) {
  newSupplier.value = {
    ...(Suppliers.value as SupplierModel[]).find((el) => el.id === id),
  } as SupplierModel;

  isEditMode.value = true;
  supplierModal.value = true;
}

watchEffect(() => {
  if (isValidating.value) return loading.show();

  if (!isValidating.value) return loading.hide();
});

async function createSupplier() {
  const res = await form.value?.validate();

  if (!res) return useNotify('negative', 'Please fill the required fields !');

  loading.show();

  try {
    await createEntity(newSupplier.value);

    supplierModal.value = false;
    useNotify('positive', 'Supplier  created successfully !');

    await mutate();
  } catch (error) {
    console.log(error);

    useNotify('negative', 'Unable to create supplier.');
  } finally {
    loading.hide();
    resetSupplier();
  }
}

async function updateSupplier() {
  const res = await form.value?.validate();

  if (!res) return useNotify('negative', 'Please fill the required fields !');

  const supplier = Suppliers.value?.filter((el) => el.id === newSupplier.value.id)[0];

  if (!supplier) return;
  const changedSupplier = getDiff(supplier, newSupplier.value);
  if (!Object.keys(changedSupplier).length) return;

  loading.show();

  try {
    await updateEntity(
      {
        ...changedSupplier,
        gstin:
          changedSupplier.registered_gst_member === false ? '' : changedSupplier.gstin || undefined,
      },
      newSupplier.value?.id,
    );

    supplierModal.value = false;
    isEditMode.value = false;
    resetSupplier();
    useNotify('positive', 'Supplier  updated successfully !');

    await mutate();
  } catch (error) {
    console.log(error);
    useNotify('negative', error.response.statusText);
  } finally {
    loading.hide();
  }
}

async function removeSupplier(supplier: SupplierModel) {
  const res = await form.value?.validate();

  if (!res) return useNotify('negative', 'Please fill the required fields !');
  loading.show();

  try {
    await removeEntity(supplier.id as number);

    supplierModal.value = false;
    isEditMode.value = false;
    resetSupplier();
    useNotify('positive', 'Supplier removed successfully !');

    await mutate();
  } catch (error) {
    console.log(error);
    useNotify('negative', error.response.statusText);
  } finally {
    loading.hide();
  }
}

watchEffect(() => {
  if (!newSupplier.value.registered_gst_member) {
    newSupplier.value.gstin = '';
  }
});
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <q-dialog v-model="supplierModal" @hide="resetSupplier(), (isEditMode = false)">
      <q-card style="width: 700px; max-width: 700px" class="bg q-pb-sm">
        <q-form @submit.prevent="isEditMode ? updateSupplier() : createSupplier()" ref="form">
          <q-card-section>
            <span class="text-h5" v-if="!isEditMode">Add a new Supplier</span>
            <span class="text-h5" v-else>Editing {{ newSupplier.name }}</span>
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
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.email"
                  name="Supplier E-mail"
                  required
                  label-from-name
                  type="email"
                />
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
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newSupplier.address"
                  name="Supplier address"
                  required
                  label-from-name
                  type="textarea"
                  autogrow
                />
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
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-gutter-x-md q-px-md">
            <app-delete-button v-if="isEditMode" @remove="removeSupplier(newSupplier)" />
            <q-btn
              :label="isEditMode ? 'Update' : 'Submit'"
              no-caps
              color="primary"
              unelevated
              text-color="black"
              type="submit"
            />
            <q-btn label="Cancel" no-caps color="negative" unelevated outline v-close-popup />
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
          />
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
        <template #top>
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
            <template #append>
              <q-icon name="search" color="dark" />
            </template>
          </q-input>
        </template>

        <template #header="props">
          <q-tr :props="props" class="bg-primary">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th auto-width />
          </q-tr>
        </template>

        <template #body="props">
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
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
