<script setup lang="ts">
import { User } from 'src/store/user';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useNotify } from 'src/utils/helpers';
import { TopNewNav } from 'src/utils/constants';

const store = useStore();
const router = useRouter();

defineEmits(['toggle-drawer']);

const user = computed((): User => store.getters['users/getUser']);
const isLoggedIn = computed((): boolean => store.getters['users/isLoggedIn']);

async function logout() {
  await store.dispatch('users/LOGOUT');

  useNotify('positive', 'Logged out successfully');

  await router.push('/');

  // to make sure drawer doesn't break
  location.reload();
}

function redirectToHelp() {
  window.open('https://billbird.tawk.help/', '_blank');
}

function setSettings() {
  store.commit('misc/setSettings', null, { root: true });
}
</script>

<template>
  <q-toolbar>
    <q-toolbar-title class="text-dark flex-none">
      <router-link to="/" class="flex items-center text-lg space-x-2">
        <img src="/icons/favicon-16x16.png" alt="BillBird logo" />
        <span><b>BillBird</b></span>
      </router-link>
    </q-toolbar-title>

    <q-space />

    <q-btn
      icon="las la-plus"
      dense
      unelevated
      flat
      text-color="dark"
      round
      v-if="isLoggedIn"
      title="Create new"
    >
      <q-menu max-width="200" style="width: 200px" class="bg">
        <q-list style="min-width: 100px">
          <q-item
            clickable
            v-close-popup
            :to="nav.path"
            :key="nav.path"
            v-for="nav in TopNewNav"
            exact
          >
            <q-item-section avatar><q-icon :name="nav.icon" /></q-item-section>
            <q-item-section>{{ nav.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn
      v-if="isLoggedIn"
      text-color="dark"
      flat
      :icon="isLoggedIn && 'las la-user-tie'"
      :label="isLoggedIn ? user.username : 'Login'"
      stretch
      no-caps
    >
      <q-menu max-width="200" style="width: 200px" class="bg">
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup to="/" exact>
            <q-item-section avatar><q-icon name="las la-home"></q-icon></q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="setSettings">
            <q-item-section avatar><q-icon name="las la-cog"></q-icon></q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-close-popup @click="redirectToHelp">
            <q-item-section avatar><q-icon name="las la-question"></q-icon></q-item-section>
            <q-item-section>Help &amp; Feedback</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-close-popup @click="logout">
            <q-item-section avatar><q-icon name="las la-sign-out-alt"></q-icon></q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <template v-else>
      <div class="flex space-x-3" v-if="$q.screen.width > 512">
        <q-btn flat unelevated color="black" label="Pricing" no-caps />
        <q-btn flat unelevated color="black" to="/login" label="Login" no-caps />
      </div>
    </template>
    <q-btn
      v-if="$q.screen.width < 490 && $route.path !== '/home'"
      flat
      round
      dense
      icon="menu"
      class="hide-toggle"
      color="black"
      @click="$emit('toggle-drawer')"
    />
  </q-toolbar>
</template>
<style lang="scss" scoped>
.q-item__section--avatar {
  min-width: 36px !important;
}
</style>
