<script setup lang="ts">
import { computed } from 'vue';
import { MainNav } from 'src/utils/constants';
import { useMainRoute } from 'src/utils/helpers';

const { path } = useMainRoute();

const navItems = computed(() => {
  if (path === '/') return [];

  return MainNav[path.split('/')[1]];
});
</script>

<template>
  <q-scroll-area class="fit">
    <q-list>
      <q-item v-if="$q.screen.lt.md">
        <q-item-section class="flex items-center flex-row justify-start">
          <q-avatar icon="img:/icons/favicon-16x16.png" class="flex-none" />
          <q-item-label class="text-lg flex-grow"><b>BillBird</b></q-item-label>
        </q-item-section>
      </q-item>

      <q-item to="/">
        <q-item-section side>
          <q-icon color="dark" name="las la-arrow-circle-left" class="flex-none" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-lg">Back to apps</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-for="route in navItems"
        :key="route.path"
        :to="route.path"
        active-class="bg-bbg-light"
        :active="$route.path === route.path"
      >
        <q-item-section side>
          <q-icon color="dark" :name="route.icon" />
        </q-item-section>

        <q-item-section class="text-lg">
          {{ route.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>
