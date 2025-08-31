'use client';

import { useParams, useRouter } from 'next/navigation';
// import { useParams, useRouter } from 'next/navigation';
// import { useQuery } from '@tanstack/react-query';

import { fetchPostById, fetchUserById } from '@/lib/api';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/user';

export default function PostDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const { data: post } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    refetchOnMount: false,
  });

  const handleClickBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!post) return;

    const fn = async () => {
      const response = await fetchUserById(post.userId);
      setUser(response);
    };
    fn();
  }, [post]);

  return (
    <>
      <main className={css.main}>
        <div className={css.container}>
          <div className={css.item}>
            <button onClick={handleClickBack} className={css.backBtn}>
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
          </div>
        </div>
      </main>
    </>
  );
}
