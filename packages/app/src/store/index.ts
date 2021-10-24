import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';
import miscModule from './misc';
import userModule from './user/index';

export interface StateInterface {
  user: typeof userModule;
  misc: typeof miscModule;
}

export default store(() => {
  const Store = createStore<StateInterface>({
    actions: {},
    modules: {
      users: userModule,
      misc: miscModule,
    },

    strict: !!process.env.DEBUGGING,
  });

  return Store;
});
