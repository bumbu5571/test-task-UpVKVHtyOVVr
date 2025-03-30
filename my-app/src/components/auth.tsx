'use client';

import { useState, useTransition } from 'react';
import styles from './auth.module.scss';
import { $authState, login, logout } from '../store/index';
import { useStore } from '@nanostores/react';
import { authenticate } from '@/lib/api';

export default function Auth() {
  const [formValue, setformValue] = useState<{
    email: string;
    password: string;
  }>({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const user = useStore($authState);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const { auth, error } = await authenticate(
        formValue.email,
        formValue.password
      );

      if (error) {
        setErrorMessage(error);
        return;
      }

      if (auth) {
        login(auth);
        setformValue({
          email: '',
          password: '',
        });
      }
      return;
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputTarget = e.target;
    setformValue((prev) => ({ ...prev, [inputTarget.id]: inputTarget.value }));
  }

  return user?.username === '' ? (
    isPending ? (
      <p>Загрузка...</p>
    ) : (
      <form onSubmit={handleSubmit} className={styles.container}>
        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={formValue.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={formValue.password}
            onChange={handleChange}
          />
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type='submit' disabled={isPending}>
          Login
        </button>
      </form>
    )
  ) : (
    <div className={styles.container}>
      <p>Добро пожаловать {user.username}!</p>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}
