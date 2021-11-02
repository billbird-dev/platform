import { api } from 'src/boot/axios';
import { Company } from 'src/store/user';

export function updateCompany(payload: Partial<Company>) {
  return api.patch<Company>('/company', { ...payload });
}
