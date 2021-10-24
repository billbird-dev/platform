import { api, setToken } from 'src/boot/axios';
import { Module } from 'vuex';
import { StateInterface } from 'src/store/index';
import { Loading } from 'quasar';

export interface User {
  id?: string;
  last_login?: Date;
  username?: string;
  email?: string;
  is_active?: boolean;
  date_joined?: Date;
  name?: string;
  phone?: number;
  is_premium_member?: boolean;
  branch?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  gstin?: string;
  state_code?: string;
  parent_company?: string;
  role?: string;
}

export interface userStateInterface {
  isLoggedIn: boolean;
  data: User;
}

const userModule: Module<userStateInterface, StateInterface> = {
  namespaced: true,
  state: (): userStateInterface => {
    return {
      isLoggedIn: false,
      data: {},
    };
  },
  mutations: {
    setLogin: (state, paylaod: boolean) => {
      state.isLoggedIn = paylaod;
    },
    setUser: (state, payload: Record<string, any>) => {
      state.data = payload;
    },
  },
  actions: {
    USER: ({ commit }, data) => {
      commit('setLogin', data !== null);
      if (data !== null) {
        commit('setUser', data);
      } else {
        commit('setUser', {});
      }
    },
    LOGIN: ({ dispatch }, payload: Record<string, any>) => {
      return new Promise(async (resolve, reject) => {
        Loading.show();

        try {
          const {
            data: { company, access, refresh },
          } = await api({
            url: '/auth/login/',
            method: 'post',
            data: {
              ...payload,
            },
          });

          const user = company;
          dispatch('USER', user);

          setToken(access);
          document.cookie = `__btoken=${refresh as string};max-age=259200`;

          resolve(user);
        } catch (error) {
          await dispatch('USER', null);
          setToken(null);

          reject((error as any).response.data.detail);
        } finally {
          Loading.hide();
        }
      });
    },
    async LOGOUT({ dispatch }) {
      await dispatch('USER', null);

      setToken(null);
      document.cookie = '__btoken=delete;max-age=0';
    },
  },
  getters: {
    getUser: (state) => state.data,
    isLoggedIn: (state) => state.isLoggedIn,
  },
};

export default userModule;
