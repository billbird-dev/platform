<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useNotify } from 'src/utils/helpers';
import AppInput from 'src/components/App/AppInput.vue';

interface UserLogin {
  username?: string;
  password?: string;
}

const store = useStore();
const router = useRouter();

const isLoggedIn = computed((): boolean => store.getters['users/isLoggedIn']);
const isForgotPassword = ref(false);
const forgotUserEmail = ref('');
const user = ref<UserLogin>({
  username: '',
  password: '',
});

const login = async () => {
  try {
    await store.dispatch('users/LOGIN', user.value);

    router.push('/home');
    useNotify('positive', 'Logged in successfully');
  } catch (error) {
    user.value = {
      username: '',
      password: '',
    };
    useNotify('negative', error);
  }
};
</script>

<template>
  <q-page class="flex justify-center pt-20">
    <!-- //TODO: forgot password modal -->
    <q-dialog v-model="isForgotPassword">
      <q-card style="width: 400px; max-width: 700px" class="bg">
        <q-form>
          <q-card-section>
            <span class="text-h5">Forgot password</span>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pb-none">
            <app-input
              name="Email"
              v-model="forgotUserEmail"
              type="email"
              placeholder="Enter your E-mail"
              required
            />
          </q-card-section>

          <q-card-section class="text-right">
            <q-btn
              label="Submit"
              color="primary"
              unelevated
              text-color="dark"
              no-caps
              type="submit"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>

    <div class="sm:max-w-[450px] w-full max-w-full m-4" v-if="!isLoggedIn">
      <q-banner dense rounded class="q-mb-lg bg-orange-11 text-dark">
        <template v-slot:avatar>
          <q-icon name="las la-info" size="sm" color="dark" />
        </template>
        Site is work in progress. Some parts are not done yet!
      </q-banner>

      <div class="bg-bbg-light rounded-lg flex flex-col space-y-2 p-4 justify-center text-center">
        <div class="w-[50px] py-2 m-auto">
          <img class="max-w-full" src="/icons/favicon-96x96.png" alt="" />
        </div>

        <q-form @submit="login" class="flex flex-col space-y-2">
          <q-input
            standout
            v-model="user.username"
            placeholder="Username"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter username']"
            dense
            type="text"
          />

          <q-input
            dense
            standout
            type="password"
            v-model="user.password"
            placeholder="Password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter password']"
          />

          <q-btn
            label="Login"
            class="bg-primary-dark full-width text-black"
            unelevated
            type="submit"
            color="primary"
            no-caps
          />
        </q-form>

        <div
          class="text-blue-grey-6 cursor-pointer text-xs pt-4"
          @click="isForgotPassword = !isForgotPassword"
        >
          Forgot password ?
        </div>
      </div>
    </div>
  </q-page>
</template>
