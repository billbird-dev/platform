import { Notify, date } from 'quasar';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import useSWRV, { IConfig } from 'swrv';
import { AxiosError, AxiosResponse } from 'axios';

import { StateInterface } from 'src/store';
import { fetcherFn } from 'swrv/dist/types';
import { api } from 'src/boot/axios';
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage';

const CACHE_TTL = 7 * 21 * 60 * 60 * 60;

/**
 * Get a cookie from browser by name
 * @param {string} name Name of the cookie
 */
export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const part = parts.pop() as string;
    return part.split(';').shift();
  }
};

/**
 * Capitalize the first letter of a string
 * @param {string} string
 */
export function firstCapitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Create a quasar notification without the usual API
 * @param {string} type The notification type
 * @param {string} message notification mesaage
 */
export const useNotify = (type: 'positive' | 'negative' | 'warning', message: string) => {
  let color: string;
  switch (type) {
    case 'positive':
      color = 'light-green-6';
      break;
    case 'negative':
      color = 'red-4';
      break;
    default:
      color = 'primary-4';
      break;
  }
  return Notify.create({
    type: type,
    message: message,
    color: color,
    timeout: 2000,
  });
};

// export function queryParser(query: string) {
//   const queryString = query.split('?')[1];
//   return JSON.parse(
//     '{"' +
//       decodeURI(queryString.replace(/&/g, '","').replace(/=/g, '":"')) +
//       '"}',
//   );
// }

/**
 * useMainStore Hook
 * @returns Vuex store
 */
export const useMainStore = () => useStore<StateInterface>();

/**
 * useMainRouter Hook
 * @returns Vue router
 */
export const useMainRouter = () => useRouter();

/**
 * useRoute
 * @returns Current Route instance
 */
export const useMainRoute = () => useRoute();

/**
 * useSwr hook
 * @param path
 * @param fetcher
 * @param config
 * @returns useSWRV instance
 */
export const useSwr = <T>(
  path: string,
  fetcher: fetcherFn<any>,
  config?: IConfig<any, fetcherFn<T[]>>,
) =>
  useSWRV<T[]>(path, fetcher, {
    ...config,
    refreshInterval: 600000,
    revalidateOnFocus: false,
    cache: new LocalStorageCache(),
    errorRetryCount: 2,
    ttl: CACHE_TTL,
  });

/**
 * @description create a billbird api instance for the given path
 * @param path
 * @returns
 */

export function useBillBirdApi<T>(path: string) {
  return {
    /**
     * @method getAll
     * @description get a list of all data of entity type T
     */
    async getAll(): Promise<T[]> {
      return new Promise((resolve, reject) => {
        api
          .get(path)
          .then((res: AxiosResponse<T[]>) => resolve(res.data))
          .catch((err: AxiosError) => reject(err));
      });
    },
    /**
     * @method getById
     * @description get specific entity by id
     * @param {string} id - ID of the entity
     *
     */
    async getById(id: string): Promise<T> {
      return new Promise((resolve, reject) => {
        api
          .get(`${path}${id}/`)
          .then((res: AxiosResponse<T>) => resolve(res.data))
          .catch((err: AxiosError) => reject(err));
      });
    },
    /**
     * createEntity
     * @description create a new entity
     * @param {T} data entity data
     */
    async createEntity(data: T): Promise<T> {
      return new Promise((resolve, reject) => {
        api
          .post(path, { ...data })
          .then((res: AxiosResponse<T>) => resolve(res.data))
          .catch((err: AxiosError) => reject(err));
      });
    },
    /**
     * @method updateEntity
     * @description update specific entity by id
     * @param {string} id - ID of the entity
     * @param {T} data entity data to be updated
     */
    async updateEntity(data: Partial<T>, id: number | undefined): Promise<T> {
      return new Promise((resolve, reject) => {
        api
          .patch(`${path}/${id}`, { ...data })
          .then((res: AxiosResponse<T>) => resolve(res.data))
          .catch((err: AxiosError) => reject(err));
      });
    },
    /**
     * @name removeEntity
     * @description remove an entity by ID
     * @param {string} id id of the entity
     */
    async removeEntity(id: number): Promise<any> {
      return new Promise((resolve, reject) => {
        api
          .delete(`${path}/${id}`)
          .then((res) => resolve(res.data))
          .catch((err: AxiosError) => reject(err));
      });
    },
  };
}

/**
 * get Diff upto one level
 * @param toMatch
 * @param newData
 * @returns diff data
 */
export function getDiff<T extends Record<string, any>>(toMatch: T, newData: Partial<T>) {
  return Object.entries(newData).reduce<Partial<T>>((acc, [key, value]) => {
    if (typeof value === 'boolean' && value === toMatch[key]) return acc;

    if (typeof value !== 'boolean' && !(value !== toMatch[key] && value.length > 0)) return acc;

    acc = { ...acc, [key]: value };

    return acc;
  }, {});
}

export function randomId(len?: number) {
  function dec2hex(dec: any) {
    return dec.toString(16).padStart(2, '0');
  }

  const arr = new Uint8Array((len || 30) / 2);
  window.crypto.getRandomValues(arr);

  return Array.from(arr, dec2hex).join('');
}

export const formatDate = (data: string, format?: string) =>
  date.formatDate(data, format || 'YYYY-MM-DD');

export const getErrorMessage = (error: any): string => {
  return (
    (!!error.response && !!error.response.data && error.response.data.message) ||
    'Some error occured !'
  );
};
