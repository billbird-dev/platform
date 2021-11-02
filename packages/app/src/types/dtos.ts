export interface LoginKey {
  email?: string;
  username?: string;
}

export interface LoginDto {
  key: LoginKey;
  password: string;
}
