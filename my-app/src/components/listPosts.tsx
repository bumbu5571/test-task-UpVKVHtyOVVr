import { Post } from '@/types';
import Pagination from './pagination';
import Link from 'next/link';

export default function ListPosts({
  listPosts,
  totalPages,
}: {
  listPosts: Post[];
  totalPages: number;
}) {
  return (
    <>
      <ul>
        {listPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
      <Pagination totalPages={totalPages} />
    </>
  );
}
