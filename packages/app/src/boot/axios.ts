import { boot } from 'quasar/wrappers';
import axios, { AxiosError } from 'axios';
import { useNotify } from 'src/utils/helpers';
import { getTokens } from 'src/composables/auth';
import { Loading, LocalStorage } from 'quasar';

export const api = axios.create({ baseURL: process.env.APP_API, withCredentials: true });

export const setToken = (token: string | null) => {
  if (token === null) return LocalStorage.remove('__bt');
  LocalStorage.set('__bt', token);
};

//TODO: test this
export default boot(({ store, router }) => {
  async function refreshTokens() {
    const rtoken = () => LocalStorage.getItem<string>('__bt');

    if (!rtoken()) {
      useNotify('negative', 'Session expired. Please login again.');

      await store.dispatch('users/LOGOUT');
      router.push('/');
      return;
    }

    Loading.show({ message: 'Please wait, session expired, authenticating with server !' });

    try {
      await getTokens();
    } catch (error) {
      useNotify('negative', 'Session expired. Please login again.');

      await store.dispatch('users/LOGOUT');

      router.push('/');
    } finally {
      Loading.hide();
    }
  }

  api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      if (
        err.response?.status === 401 ||
        err.response?.statusText.toLowerCase().includes('unauthorized')
      ) {
        await refreshTokens();
      }

      return err;
    },
  );
});
