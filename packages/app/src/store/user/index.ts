import { api, setToken } from 'src/boot/axios';
import { Module } from 'vuex';
import { StateInterface } from 'src/store/index';
import { Loading } from 'quasar';

export interface Company {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: number;
  is_premium_member: boolean;
  is_parent: boolean;
  sale_invoice_count: number;
  purchase_invoice_count: number;
  estimate_invoice_count: number;
  parent: Partial<Company>;
  branch: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  gstin: string;
  state_code: string;
  valid_till: Date;
  created_at: Date;
}

export interface userStateInterface {
  isLoggedIn: boolean;
  data: Company;
}

const userModule: Module<userStateInterface, StateInterface> = {
  namespaced: true,
  state: (): userStateInterface => {
    return {
      isLoggedIn: false,
      data: {} as any,
    };
  },
  mutations: {
    setLogin: (state, paylaod: boolean) => {
      state.isLoggedIn = paylaod;
    },
    setUser: (state, payload: Company) => {
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
            data: { company, token },
          } = await api.post<{ company: Company; token: string }>('/auth/login', {
            ...payload,
          });

          dispatch('USER', company);
          setToken(token);

          resolve(company);
        } catch (error) {
          await dispatch('USER', null);

          reject((error as any).response.data.detail);
        } finally {
          Loading.hide();
        }
      });
    },
    async LOGOUT({ dispatch }) {
      try {
        setToken(null);
        await dispatch('USER', null);
        await api.post('/auth/log-out');
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    getUser: (state) => state.data,
    isLoggedIn: (state) => state.isLoggedIn,
  },
};

export default userModule;
