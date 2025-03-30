import CommentCard from '@/components/commentCard';
import { Comment, Post, User } from '@/types';
import styles from './page.module.scss';
import { getFetch } from '@/lib/api';
import { Metadata } from 'next';

export const revalidate = 300;
export const dynamicParams = true;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const posts: Post[] = await getFetch<Post[]>('allPosts');

    return posts.map((post) => ({
      id: String(post.id),
    }));
  } catch (error: any) {
    console.error(error);
    return [];
  }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  try {
    const post: Post = await getFetch<Post>('post', { id });

    if (!post) {
      return {
        title: 'пост не найден',
        description: 'Запрошенный пост не найден',
      };
    }

    return {
      title: `пост №${post.id}: ${post.title}`,
      description: post.body,
    };
  } catch (error: any) {
    console.error(error);
    return {
      title: 'ошибка загрузки поста',
      description: 'Произошла ошибка при загрузке поста',
    };
  }
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const post: Post = await getFetch<Post>('post', { id });
    const [user, comments] = await Promise.all([
      getFetch<User>('users', { id: String(post.userId) }),
      await getFetch<Comment[]>('comments', { id }),
    ]);

    return (
      <div className={styles.container}>
        <h2>{post.title}</h2>
        <p>{user.name}</p>
        <p>{post.body}</p>
        <h3>Comments: </h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentCard comment={comment} />
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error: any) {
    return <h2>Сообщение об ошибке: {error.message}</h2>;
  }
}
