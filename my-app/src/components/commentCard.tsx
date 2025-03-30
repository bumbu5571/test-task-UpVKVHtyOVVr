import { Comment } from '@/types';
import styles from './commentCard.module.scss';

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className={styles.container}>
      <h4>{comment.name}</h4>
      <p>
        Email: <a href={`mailto:${comment.email}`}>{comment.email}</a>
      </p>
      <p>{comment.body}</p>
    </div>
  );
}
