import ListPosts from '@/components/listPosts';
import { Post } from '@/types';
import { getFetch } from '../../lib/api';
import type { Metadata, ResolvingMetadata } from 'next';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const title = `список постов страница ${currentPage}`;
  const description = `Список постов страница ${currentPage}`;

  return {
    title,
    description,
  };
}

const TOTALPOSTS: number = 100;
const LIMITPOSTS: number = 10;

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const totalPages: number = TOTALPOSTS / LIMITPOSTS;

  if (currentPage < 1 || currentPage > totalPages) {
    return <h2>Данная страница отсутствует</h2>;
  }

  try {
    const listPosts = await getFetch<Post[]>(`perPost`, {
      page: currentPage,
      limit: LIMITPOSTS,
    });

    return <ListPosts listPosts={listPosts} totalPages={totalPages} />;
  } catch (error: any) {
    return <h2>Сообщение об ошибке: {error.message}</h2>;
  }
}
