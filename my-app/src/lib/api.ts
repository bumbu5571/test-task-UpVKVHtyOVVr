'use server';

import { User } from '@/types';

export async function getFetch<T>(
  endpoint: 'allPosts' | 'perPost' | 'post' | 'comments' | 'users',
  options?: {
    id?: string;
    page?: number;
    limit?: number;
  }
): Promise<T> {
  let apiPath: string;
  switch (endpoint) {
    case 'allPosts':
      apiPath = `posts`;
      break;
    case 'perPost':
      apiPath = `posts?_page=${options?.page}&_per_page=${options?.limit}`;
      break;
    case 'post':
      apiPath = `posts/${options?.id}`;
      break;
    case 'comments':
      apiPath = options?.id ? `${endpoint}?postId=${options.id}` : endpoint;
      break;
    case 'users':
      apiPath = options?.id ? `users/${options.id}` : 'users';
      break;
    default:
      throw new Error(`Invalid endpoint: ${endpoint}`);
  }
  const url = new URL(apiPath, 'https://jsonplaceholder.typicode.com');

  const res = await fetch(url, {
    next: {
      revalidate: 300,
      tags: [apiPath],
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    const message = `Failed to fetch ${apiPath}: ${res.status} - ${res.statusText}`;
    throw new Error(message);
  }

  return await res.json();
}

export async function authenticate(
  email: string,
  password: string
): Promise<{
  auth?: {
    access_token: string;
    username: string;
  };
  error?: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!email || !password) {
    return { error: 'Введите логин и пароль' };
  }
  try {
    const users: User[] = await getFetch('users');
    const user = users.find((user) => user.email === email);

    if (!user) {
      return { error: 'Неверный пароль или email' };
    }

    if (password === 'qwer1234') {
      return {
        auth: {
          username: user.username,
          access_token: crypto.randomUUID(),
        },
      };
    } else {
      return { error: 'Неверный пароль или email' };
    }
  } catch (error: any) {
    console.error('Ошибка при аутентификации:', error);
    return { error: 'Произошла ошибка при аутентификации' };
  }
}
