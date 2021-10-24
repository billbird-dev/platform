<script setup lang="ts">
import { User } from 'src/store/user';
import { useBillBirdApi, useMainStore, useNotify } from 'src/utils/helpers';
import { ref, computed, onMounted } from 'vue';
import AppInput from 'components/App/AppInput.vue';
import { useQuasar } from 'quasar';

const store = useMainStore();
const { loading } = useQuasar();

const GSTPrefs = ref({
  cgst_percentage: 0,
  sgst_percentage: 0,
  igst_percentage: 0,
  discount_percentage: 0,
});
const userData = computed((): User => store.getters['users/getUser']);
const purchasePrefApi = useBillBirdApi('/purchase/preferences/');
const salePrefApi = useBillBirdApi('/sale/preferences/');
const userUpdated = ref<User>({});
const prefType = ref<'sale' | 'purchase'>('sale');
const tab = ref('gst');
const leftDrawer = ref(false);

onMounted(async () => {
  userUpdated.value = { ...userData.value };
  getPrefs();
});

function resetPrefs() {
  GSTPrefs.value = {
    cgst_percentage: 0,
    sgst_percentage: 0,
    igst_percentage: 0,
    discount_percentage: 0,
  };
}

async function getPrefs() {
  resetPrefs();
  loading.show();

  try {
    let res: typeof GSTPrefs.value;
    if (prefType.value === 'sale') {
      res = (await salePrefApi.getAll()) as any;
      if (Object.keys(res).length === 0) return;

      const { cgst_percentage, sgst_percentage, igst_percentage, discount_percentage } = res;
      GSTPrefs.value = {
        discount_percentage,
        igst_percentage,
        sgst_percentage,
        cgst_percentage,
      };
      return;
    }

    res = (await purchasePrefApi.getAll()) as any;
    if (Object.keys(res).length === 0) return;

    const { cgst_percentage, sgst_percentage, igst_percentage, discount_percentage } = res;
    GSTPrefs.value = { cgst_percentage, sgst_percentage, igst_percentage, discount_percentage };
  } catch (error) {
    resetPrefs();
  } finally {
    loading.hide();
  }
}

async function setPrefs(type: 'sale' | 'purchase') {
  try {
    if (type === 'sale') {
      await salePrefApi.createEntity({ ...GSTPrefs.value });
    } else {
      await purchasePrefApi.createEntity({ ...GSTPrefs.value });
    }

    await getPrefs();
    useNotify('positive', 'Updated successfully !');
  } catch (error) {
    useNotify('negative', error.response.statusText);
  }
}
</script>

<template>
  <q-layout
    view="hHh lpR fFf"
    container
    class="bg"
    :style="!$q.screen.lt.md ? 'height: 600px' : ''"
  >
    <q-header class="bg-primary text-white">
      <q-toolbar class="text-dark">
        <q-toolbar-title>Settings</q-toolbar-title>
        <q-space />
        <q-btn flat round icon="las la-arrow-circle-left" v-close-popup v-if="$q.screen.lt.md" />
        <q-btn flat round icon="menu" @click="leftDrawer = !leftDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawer" :width="200" side="left" overlay>
      <q-tabs
        v-model="tab"
        vertical
        active-color="dark"
        indicator-color="primary"
        no-caps
        inline-label
        class="bg"
      >
        <q-tab
          style="justify-content: left"
          name="gst"
          icon="las la-money-check-alt"
          label="GST"
          @click="leftDrawer = false"
        />
        <q-tab
          style="justify-content: left"
          name="profile"
          icon="las la-user-tie"
          label="Profile"
          @click="leftDrawer = false"
        />
        <q-tab
          style="justify-content: left"
          name="theme"
          icon="las la-palette"
          label="Theme"
          @click="leftDrawer = false"
        />
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <q-page>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          transition-prev="slide-right"
          transition-next="slide-left"
          class="bg"
        >
          <q-tab-panel name="gst">
            <div class="row justify-between q-pb-md">
              <div>
                <div class="text-h5">GST</div>
                <div class="text-caption">Set your GST preferences</div>
              </div>

              <q-toggle
                v-model="prefType"
                color="prmary"
                size="lg"
                left-label
                icon-color="dark"
                keep-color
                :icon="prefType === 'sale' ? 'las la-file-invoice' : 'las la-shopping-cart'"
                :label="prefType === 'sale' ? 'Sale' : 'Purchase'"
                true-value="sale"
                false-value="purchase"
                @update:model-value="getPrefs"
              />
            </div>

            <q-form @submit.prevent="() => setPrefs(prefType)">
              <div class="q-pt-none q-gutter-y-xs">
                <app-input
                  name="CGST"
                  :required="false"
                  labelFromName
                  type="number"
                  v-model="GSTPrefs.cgst_percentage"
                />
                <app-input
                  name="SGST"
                  :required="false"
                  labelFromName
                  type="number"
                  v-model="GSTPrefs.sgst_percentage"
                />
                <app-input
                  name="IGST"
                  :required="false"
                  labelFromName
                  type="number"
                  v-model="GSTPrefs.igst_percentage"
                />
                <app-input
                  name="Discount"
                  :required="false"
                  labelFromName
                  type="number"
                  v-model="GSTPrefs.discount_percentage"
                />
              </div>

              <div class="flex justify-end">
                <q-btn
                  label="Save"
                  no-caps
                  color="primary"
                  unelevated
                  text-color="dark"
                  type="submit"
                />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="profile">
            <div class="q-pb-md">
              <div class="text-h5">Profile</div>
              <div class="text-caption">manage your profile</div>
            </div>

            <q-form>
              <div class="q-pt-none q-gutter-y-xs">
                <app-input
                  name="Name"
                  :required="false"
                  labelFromName
                  hint="Changing this will affect the Tax invoice numbering."
                  v-model="userUpdated.name"
                />
                <app-input
                  name="Mobile no."
                  :required="false"
                  labelFromName
                  type="number"
                  v-model="userUpdated.phone"
                />
                <app-input
                  name="Email"
                  :required="false"
                  labelFromName
                  v-model="userUpdated.email"
                />
                <app-input
                  name="Branch"
                  :required="false"
                  labelFromName
                  v-model="userUpdated.branch"
                />
                <app-input
                  name="Address"
                  :required="false"
                  labelFromName
                  v-model="userUpdated.address"
                />
                <app-input name="City" :required="false" labelFromName v-model="userUpdated.city" />
                <app-input
                  name="Pin code"
                  :required="false"
                  labelFromName
                  v-model="userUpdated.pin_code"
                />
              </div>

              <div class="flex justify-end">
                <q-btn label="Save" no-caps color="primary" unelevated text-color="dark" />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="theme">
            <div class="q-pb-md">
              <div class="text-h5">Theme</div>
              <div class="text-caption">Configure BillBird theming</div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
