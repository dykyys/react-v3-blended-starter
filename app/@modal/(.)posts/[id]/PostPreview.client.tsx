'use client';
import Modal from '@/components/Modal/Modal';
import { fetchPostById, fetchUserById } from '@/lib/api';
import css from './PostPreview.module.css';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export default function PostPreviewClient() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const { data: post } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    refetchOnMount: false,
  });
  useEffect(() => {
    if (!post) return;

    const fn = async () => {
      const response = await fetchUserById(post.userId);
      setUser(response);
    };
    fn();
  }, [post]);

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <button onClick={handleClose} className={css.backBtn}>
        ← Back
      </button>
      {post && (
        <div className={css.post}>
          <div className={css.wrapper}>
            <div className={css.header}>
              <h2>{post.title}</h2>
            </div>

            <p className={css.content}>{post.body}</p>
          </div>
          {user && <p className={css.user}>Author: {user.name}</p>}
        </div>
      )}
    </Modal>
  );
}
