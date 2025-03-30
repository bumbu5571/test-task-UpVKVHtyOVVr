import type { Metadata } from 'next';
import styles from './layout.module.scss';
import Navbar from '@/components/navbar';
import { Oswald } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    template: 'тестовое задание - UpVKVHtyOVVr - %s',
    default: 'тестовое задание - UpVKVHtyOVVr',
  },
  description: 'Тестовое задание - UpVKVHtyOVVr',
};

const oswald = Oswald({
  subsets: ['cyrillic'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={oswald.className}>
        <Navbar />
        <div className={styles.container}>{children}</div>
      </body>
    </html>
  );
}
