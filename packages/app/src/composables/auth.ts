import { api, setToken } from 'src/boot/axios';

export async function getTokens() {
  try {
    const {
      data: { token },
    } = await api.get<{ token: string }>('auth/refresh');

    setToken(token);
  } catch (error) {
    console.log(error);

    throw new Error('failed to get token');
  }
}
