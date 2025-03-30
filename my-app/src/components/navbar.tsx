'use client';

import Link from 'next/link';
import styles from './navbar.module.scss';
import { useStore } from '@nanostores/react';
import { $authState, logout } from '../store/index';

export default function Navbar() {
  const user = useStore($authState);

  return (
    <nav className={styles.container}>
      <ul>
        <li>
          <Link href={'/'}>Главная</Link>
        </li>
        <li>
          <Link href={'/posts'}>Посты</Link>
        </li>
        <li className={styles.user}>
          {user?.username === '' ? (
            <span>Аноним</span>
          ) : (
            <>
              <span>{user.username}</span>
              <button onClick={() => logout()}>logout</button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
