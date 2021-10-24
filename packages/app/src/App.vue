<template>
  <q-dialog
    :model-value="isSettings"
    @update:model-value="setSettings"
    :maximized="$q.screen.lt.md"
  >
    <app-settings />
  </q-dialog>

  <router-view />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import AppSettings from 'components/App/AppSettings.vue';
import { LoadingBar } from 'quasar';

const store = useStore();

LoadingBar.setDefaults({
  color: 'white',
  size: '10x',
  position: 'top',
});

const isSettings = computed((): boolean => store.getters['misc/getSettings']);

function setSettings() {
  store.commit('misc/setSettings', null, { root: true });
}
</script>
