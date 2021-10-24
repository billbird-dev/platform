/* eslint-disable */

import { register } from 'register-service-worker';

register(process.env.SERVICE_WORKER_FILE, {
  ready(/* registration */) {
    // console.log(
    //   ' %c Service worker is active.',
    //   'background: #ddd; color: #0000ff'
    // );
  },

  registered(/* registration */) {
    // console.log(
    //   ' %c Service worker has been registered.',
    //   'background: #ddd; color: #0000ff'
    // );
  },

  cached(/* registration */) {
    // console.log(
    //   ' %c Content has been cached for offline use.',
    //   'background: #ddd; color: #0000ff'
    // );
  },

  updatefound(/* registration */) {
    // console.log(
    //   ' %c New content is downloading.',
    //   'background: #ddd; color: #0000ff'
    // );
  },

  updated(/* registration */) {
    // console.log(
    //   ' %c New content is available; please refresh.',
    //   'background: #ddd; color: #0000ff'
    // );
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  },

  offline() {
    // console.log(
    //   ' %c No internet connection found. App is running in offline mode.',
    //   'background: #ddd; color: #0000ff'
    // );
  },

  error(/* err */) {
    // console.error(
    //   ' %c Error during service worker registration:',
    //   'background: #ddd; color: #0000ff',
    //   err
    // );
  },
});
