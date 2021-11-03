<script setup lang="ts">
import { Company } from 'src/store/user';
import InfoBlock from 'components/User/InfoBlock.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import Module from 'src/components/User/Module.vue';
import { MainNav } from 'src/utils/constants';

const store = useStore();

const user = computed((): Company => store.getters['users/getUser']);
const apps = Object.values(MainNav).map((val) => val[0]);
</script>

<template>
  <q-page class="m-auto sm:max-w-[900px] p-5">
    <info-block :user="user" />

    <div class="bg-light p-4 mt-6 rounded-md">
      <div class="text-2xl pb-4">Your apps</div>
      <div class="grid md:grid-cols-6 grid-cols-2">
        <module
          :icon="app.icon"
          :label="app.name"
          v-for="app in apps"
          :key="app.path"
          :path="app.path"
          class="m-2"
        />
      </div>
    </div>
  </q-page>
</template>
