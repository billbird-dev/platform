import axios from 'axios';
import { setToken } from 'src/boot/axios';
import { getCookie } from 'src/utils/helpers';

export async function getTokens() {
  const rtoken = getCookie('__btoken') as string;

  try {
    const {
      data: { access, refresh },
    } = await axios({
      baseURL: process.env.APP_API,
      method: 'post',
      url: '/auth/token/',
      data: {
        refresh: rtoken,
      },
    });

    setToken(access);
    document.cookie = `__btoken=${refresh as string};max-age=259200`;

    return { access, refresh };
  } catch (error) {
    console.log(error);
    setToken(null);

    throw new Error('failed to get token');
  }
}
