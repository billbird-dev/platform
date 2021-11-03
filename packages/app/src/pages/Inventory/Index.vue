<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { InventoryTableColumns } from 'src/utils/constants';
import { ProductModel } from 'src/types/interfaces';
import AppInput from 'components/App/AppInput.vue';
import { getDiff, useBillBirdApi, useNotify, useSwr } from 'src/utils/helpers';
import { QForm, useQuasar } from 'quasar';
import AppDeleteButton from 'components/App/AppDeleteButton.vue';

const initialPagination = {
  sortBy: 'date',
  descending: true,
  page: 1,
  rowsPerPage: 20,
};
const { getAll, createEntity, updateEntity, removeEntity } =
  useBillBirdApi<ProductModel>('/inventory');
const { loading } = useQuasar();

const filter = ref('');
const productModal = ref(false);
const newProduct = ref<ProductModel>({
  brand: '',
  code: '',
  description: '',
  hsn_code: '',
  name: '',
  quantity: 0,
  rate: 0,
  unit: 'pcs',
});

const resetProduct = () =>
  (newProduct.value = {
    brand: '',
    code: '',
    description: '',
    hsn_code: '',
    name: '',
    quantity: 0,
    rate: 0,
    unit: 'pcs',
  });

const form = ref<null | QForm>(null);
const isEditMode = ref(false);
const { data, mutate, isValidating } = useSwr<ProductModel>('/inventory/', getAll);

function editMode(id: number) {
  newProduct.value = {
    ...((data.value as ProductModel[]).find((el) => el.id === id) as ProductModel),
  };
  isEditMode.value = true;
  productModal.value = true;
}

watchEffect(() => {
  if (isValidating.value) return loading.show();

  if (!isValidating.value) return loading.hide();
});

async function createProduct() {
  const res = await form.value?.validate();

  if (!res) return useNotify('negative', 'Please fill the required fields !');

  loading.show();
  try {
    await createEntity(newProduct.value);

    useNotify('positive', 'Product  created successfully !');

    mutate();
  } catch (error) {
    console.log(error);
    useNotify('negative', error.response.statusText);
  } finally {
    productModal.value = false;
    loading.hide();
  }
}

async function updateProduct() {
  const res = await form.value?.validate();

  if (!res) return useNotify('negative', 'Please fill the required fields !');

  const product = data.value?.filter((el) => el.id === newProduct.value.id)[0];

  if (!product) return;
  if (!Object.keys(getDiff(product, newProduct.value)).length) return;

  loading.show();
  try {
    await updateEntity(getDiff(product, newProduct.value), newProduct.value?.id);

    useNotify('positive', 'Product  updated successfully !');

    mutate();
  } catch (error) {
    console.log(error);
    useNotify('negative', error.response.statusText);
  } finally {
    productModal.value = false;
    isEditMode.value = false;
    resetProduct();

    loading.hide();
  }
}

async function removeProduct(id: number) {
  loading.show();

  try {
    await removeEntity(id);

    useNotify('positive', 'Product removed successfully !');

    mutate();
  } catch (error) {
    console.log(error);
    useNotify('negative', error.response.statusText);
  } finally {
    isEditMode.value = false;
    productModal.value = false;
    resetProduct();

    loading.hide();
  }
}

async function handleSubmit() {
  if (isEditMode.value) return await updateProduct();

  await createProduct();
}
</script>

<template>
  <q-page class="q-py-sm q-px-md">
    <q-dialog v-model="productModal" @hide="resetProduct(), (isEditMode = false)">
      <q-card style="width: 700px; max-width: 700px" class="bg q-pb-sm">
        <q-card-section>
          <span class="text-h5" v-if="!isEditMode">Add a new Product</span>
          <span class="text-h5" v-else>Editing {{ newProduct.name }}</span>
        </q-card-section>

        <q-separator />

        <q-form @submit.prevent="handleSubmit" ref="form">
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md">
              <div class="col col-sm-6 col-xs-12">
                <app-input v-model="newProduct.name" name="Product name" required label-from-name />
              </div>
              <div class="col col-sm-6 col-xs-12">
                <app-input v-model="newProduct.code" name="Product code" required label-from-name />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md">
              <div class="col col-sm-6 col-xs-12">
                <app-input
                  v-model="newProduct.hsn_code"
                  name="Product HSN code"
                  required
                  :lazyRules="false"
                  label-from-name
                />
              </div>

              <div class="col col-sm-6 col-xs-12">
                <app-input
                  v-model="newProduct.description"
                  name="Product description"
                  required
                  type="textarea"
                  autogrow
                  label-from-name
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md items-start">
              <div class="col col-sm-6 col-xs-12">
                <app-input
                  v-model.number="newProduct.rate"
                  name="Product rate"
                  required
                  type="number"
                  label-from-name
                />
              </div>
              <div class="col col-sm-6 col-xs-12">
                <app-input
                  v-model.number="newProduct.quantity"
                  name="Product quantity"
                  required
                  type="number"
                  label-from-name
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md items-start">
              <div class="col col-sm-6 col-xs-12">
                <app-input
                  v-model="newProduct.unit"
                  name="Product unit"
                  hint="e.g. pcs. , nos. , etc.."
                  required
                  label-from-name
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  v-model="newProduct.brand"
                  name="Product brand"
                  required
                  label-from-name
                />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-gutter-x-md q-px-md">
            <app-delete-button v-if="isEditMode" @remove="removeProduct(newProduct.id as number)" />
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
          <b>Inventory</b>
        </span>
        <div class="float-right">
          <q-btn
            label="Add"
            no-caps
            color="primary"
            unelevated
            text-color="black"
            @click="productModal = !productModal"
          />
        </div>
      </div>
    </div>
    <div>
      <q-table
        :table-header-style="{ backgroundColor: 'primary' }"
        flat
        :columns="InventoryTableColumns"
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
            placeholder="Search Inventory"
            hint="search by name, brand, code etc..."
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
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
