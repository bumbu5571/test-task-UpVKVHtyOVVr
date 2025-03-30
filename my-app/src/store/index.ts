import { AuthState } from '@/types';
import { map } from 'nanostores';

export const $authState = map<AuthState>({
  access_token: '',
  username: '',
});

export function login({ access_token, username }: AuthState) {
  $authState.set({
    access_token,
    username,
  });
}
export async function logout() {
  $authState.set({
    access_token: '',
    username: '',
  });
}
