import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { StateInterface } from 'src/store';
import routes from 'src/router/routes';
import { LocalStorage } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>((/* { store, ssrContext } */) => {
  const createHistory =
    process.env.MODE === 'ssr'
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, _, next) => {
    const isLoggedIn = () => LocalStorage.getItem<string>('__bt');

    if (['Landing', 'Login'].includes(to.name as string)) {
      if (isLoggedIn()) {
        return next('/home');
      }
      return next();
    }

    if (!isLoggedIn()) {
      return next('/');
    }

    next();
  });

  return Router;
});
