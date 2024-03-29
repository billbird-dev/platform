<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useStore } from 'vuex';

import AppDrawer from 'components/App/AppDrawer.vue';
import AppHeader from 'components/App/AppHeader.vue';
import { api } from 'src/boot/axios';
import { useMainRouter, useNotify } from 'src/utils/helpers';
import { LocalStorage, useQuasar } from 'quasar';
import { getTokens } from 'src/composables/auth';
import { Company } from 'src/store/user';

const store = useStore();
const { loading } = useQuasar();
const router = useMainRouter();

const isLoggedIn = computed((): boolean => store.getters['users/isLoggedIn']);
const leftDrawerOpen = ref(false);
const isInit = ref(false);
const interval = ref<NodeJS.Timeout | null>(null);

async function authUser() {
  const rtoken = () => LocalStorage.getItem<string>('__bt');

  if (!rtoken()) return (isInit.value = true);

  try {
    loading.show();

    await getTokens();

    const { data } = await api.get<Company>('/company');

    await store.dispatch('users/USER', data);

    tokenWatcher();

    isInit.value = true;
  } catch (error) {
    console.log(error);
    useNotify('negative', 'Session expired, please login again !');

    if (interval.value) clearInterval(interval.value);

    await store.dispatch('users/LOGOUT');
    router.push('/');

    isInit.value = true;
  } finally {
    loading.hide();
  }
}

function tokenWatcher() {
  const rtoken = () => LocalStorage.getItem<string>('__bt');

  if (!rtoken()) return;

  if (interval.value) clearInterval(interval.value);

  interval.value = setInterval(async () => {
    try {
      await getTokens();
    } catch (error) {
      await store.dispatch('users/LOGOUT');
      await router.push('/');

      location.reload();
    }
  }, 300000);
}

watchEffect(() => {
  if (!isLoggedIn.value && !!interval.value) {
    clearInterval(interval.value);
  }
});

authUser();
</script>

<template>
  <q-layout view="hHh Lpr lFf" v-if="isInit">
    <q-header :class="['/', '/login'].includes($route.path) ? 'bg' : 'bg-primary'">
      <app-header @toggle-drawer="leftDrawerOpen = !leftDrawerOpen" />
    </q-header>

    <q-drawer
      v-if="isLoggedIn && !['/', '/login', '/home'].includes($route.path)"
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
      show-if-above
      bordered
      class="bg-bbg"
    >
      <app-drawer class="no-print" />
    </q-drawer>

    <q-drawer
      v-else-if="['/', '/login'].includes($route.path)"
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-bbg"
    >
      <q-item v-if="$q.screen.width < 480" class="text-center" to="/">
        <q-item-section>
          <b>🐣 BillBird</b>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>Pricing</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/login">
        <q-item-section>Login</q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.path" />
    </q-page-container>
  </q-layout>
</template>
