import { Module } from 'vuex';
import { StateInterface } from 'src/store/index';

export interface MiscStateInterface {
  loader: boolean;
  settings: boolean;
}

const miscModule: Module<MiscStateInterface, StateInterface> = {
  namespaced: true,
  state: (): MiscStateInterface => {
    return {
      loader: false,
      settings: false,
    };
  },
  mutations: {
    setLoader: (state) => (state.loader = !state.loader),
    setSettings: (state) => (state.settings = !state.settings),
  },
  actions: {},
  getters: {
    getLoader: (state) => state.loader,
    getSettings: (state) => state.settings,
  },
};

export default miscModule;
