<script setup lang="ts">
import { ref } from 'vue';
import { Customer } from 'src/types/interfaces';
import AppInput from 'components/App/AppInput.vue';
import { useNotify } from 'src/utils/helpers';
import AppDeleteButton from 'components/App/AppDeleteButton.vue';
import { QForm } from 'quasar';

const emit = defineEmits([
  'updateCustomer',
  'createCustomer',
  'removeCustomer',
  'update:customer-billing',
  'update:customer-shipping',
  'update:customer-isgst',
  'update:customer-gstin',
  'update:customer-modal',
  'update:customer-name',
  'update:customer-email',
  'update:customer-phone',
  'reset',
]);

defineProps<{
  customerModal: boolean;
  isEditMode: boolean;
  newCustomer: Customer;
}>();

const form = ref<null | QForm>(null);

async function emitMethod(type: 'updateCustomer' | 'createCustomer') {
  const res = await form.value?.validate();

  if (!res) return useNotify('negative', 'Please fill the required fields !');

  emit(type);
}
</script>

<template>
  <div>
    <q-dialog
      :model-value="customerModal"
      @update:modelValue="$emit('update:customer-modal', $event)"
      @hide="$emit('reset')"
    >
      <q-card style="width: 700px; max-width: 700px" class="bg q-pb-sm">
        <q-form
          @submit.prevent="isEditMode ? emitMethod('updateCustomer') : emitMethod('createCustomer')"
          ref="form"
        >
          <q-card-section>
            <span class="text-h5" v-if="!isEditMode">Add a new customer</span>
            <span class="text-h5" v-else>Editing {{ newCustomer.name }}</span>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md">
              <div class="col-sm-6 col-xs-12">
                <app-input
                  :modelValue="newCustomer.name"
                  @update:modelValue="$emit('update:customer-name', $event)"
                  name="Customer name"
                  required
                  label-from-name
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  :modelValue="newCustomer.email"
                  @update:modelValue="$emit('update:customer-email', $event)"
                  name="Customer E-mail"
                  required
                  type="email"
                  label-from-name
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md">
              <div class="col-sm-6 col-xs-12">
                <app-input
                  :modelValue="newCustomer.phone"
                  @update:modelValue="$emit('update:customer-phone', $event)"
                  name="Customer phone"
                  required
                  mobileNum
                  :lazyRules="false"
                  label-from-name
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <app-input
                  :modelValue="newCustomer.billing_address"
                  @update:modelValue="$emit('update:customer-billing', $event)"
                  name="Customer billing address"
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
              <div class="col-sm-6 col-xs-12">
                <app-input
                  :modelValue="newCustomer.shipping_address"
                  @update:modelValue="$emit('update:customer-shipping', $event)"
                  name="Customer shipping address"
                  required
                  type="textarea"
                  autogrow
                  label-from-name
                />
              </div>
              <div class="col-sm-6 col-xs-12">
                <q-checkbox
                  label="Registered GST member"
                  :model-value="newCustomer.registered_gst_member"
                  @update:modelValue="$emit('update:customer-isgst', $event)"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-none">
            <div class="row q-col-gutter-md items-start">
              <div class="col-sm-6 col-xs-12">
                <app-input
                  :modelValue="newCustomer.gstin"
                  @update:modelValue="$emit('update:customer-gstin', $event)"
                  name="Customer GST number"
                  :disable="!newCustomer.registered_gst_member"
                  :required="false"
                  label-from-name
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-gutter-x-md q-px-md">
            <app-delete-button
              v-if="isEditMode"
              @remove="$emit('removeCustomer', newCustomer.id)"
            />
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
  </div>
</template>

<style lang="scss" scoped></style>
