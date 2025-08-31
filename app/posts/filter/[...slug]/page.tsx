import { fetchPosts } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostsClient from './Posts.client';

interface PostsPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { slug } = await params;

  const queryClient = new QueryClient();

  const userId = slug[0];

  console.log(userId);

  await queryClient.prefetchQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts({ searchText: '', page: 1, ...(userId !== 'All' && { userId }) }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsClient userId={userId} />
    </HydrationBoundary>
  );
}
