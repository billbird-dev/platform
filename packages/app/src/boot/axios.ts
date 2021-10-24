import { boot } from 'quasar/wrappers';
import axios, { AxiosError } from 'axios';
import { getCookie, useNotify } from 'src/utils/helpers';
import { getTokens } from 'src/composables/auth';
import { Loading } from 'quasar';

export const api = axios.create({ baseURL: process.env.APP_API });

export const setToken = (token: string | null) => {
  api.defaults.headers['Authorization'] = !!token ? `Bearer ${token}` : null;
};

//TODO: test this
export default boot(({ store, router }) => {
  async function refreshTokens() {
    const rtoken = () => getCookie('__btoken');

    if (!rtoken()) {
      useNotify('negative', 'Session expired. Please login again.');

      await store.dispatch('users/LOGOUT');
      setToken(null);
      router.push('/');
      return;
    }

    Loading.show({ message: 'Please wait, session expired, authenticating with server !' });

    try {
      await getTokens();
    } catch (error) {
      useNotify('negative', 'Session expired. Please login again.');

      await store.dispatch('users/LOGOUT');
      setToken(null);

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
