<script setup lang="ts">
import { Company } from 'src/store/user';
import { useMainStore } from 'src/utils/helpers';

const store = useMainStore();

defineProps<{
  user: Company;
}>();

function setSettings() {
  store.commit('misc/setSettings', null, { root: true });
}
</script>

<template>
  <div
    class="bg-light flex justify-center sm:justify-start items-start sm:space-x-5 rounded-md p-4"
  >
    <div class="flex-none flex justify-center">
      <q-avatar size="150px">
        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
      </q-avatar>
    </div>
    <div class="flex-grow pt-4 sm:pt-0">
      <div class="flex">
        <div class="flex-grow">
          <div class="text-2xl">{{ user.name }}</div>
          <div class="text-base text-blue-grey-9">{{ user.email }}</div>
          <div class="text-base text-blue-grey-9">{{ user.phone }}</div>
        </div>

        <div class="flex-none">
          <q-btn
            icon="las la-cog"
            unelevated
            flat
            round
            color="primary"
            text-color="dark"
            no-caps
            @click="setSettings"
          />
        </div>
      </div>
      <div class="grid grid-cols-2 items-center space-x-6 pt-4 overflow-ellipsis">
        <div class="flex flex-col space-y-2">
          <div class="text-xs text-blue-grey-9">
            <b>GSTIN :</b>
            {{ user.gstin }}
          </div>
          <div class="text-xs text-blue-grey-9">
            <b>BRANCH :</b>
            {{ user.branch }}
          </div>
          <div class="text-xs text-blue-grey-9">
            <b>ADDRESS :</b>
            {{ user.address }}
          </div>
        </div>

        <div class="flex flex-col space-y-2">
          <div class="text-xs text-blue-grey-9">
            <b>CITY :</b>
            {{ user.city }}
          </div>
          <div class="text-xs text-blue-grey-9">
            <b>STATE :</b>
            {{ user.state }} ({{ user.state_code }})
          </div>
          <div class="text-xs text-blue-grey-9">
            <b>PIN :</b>
            {{ user.pincode }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
