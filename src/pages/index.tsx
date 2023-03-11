import { NextPage } from 'next';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { IPost, usePostActions, usePostPosts } from '@/store/usePostStore';
import PostLoader from '@/components/Post/PostLoader';
import PostItem from '@/components/Post/PostItem';
import { Stack } from '@chakra-ui/react';
import CreatePostLink from '@/components/Community/CreatePostLink';
import usePosts from '@/hooks/usePosts';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, isLoadingUser] = useAuthState(auth);
  const { posts, setPosts, postVotes, onVote, onDeletePost, onSelectPost } = usePosts();

  const buildUserHomeFeed = () => {};

  const buildNoUserHomeFeed = async () => {
    setIsLoading(true);
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      console.log({ postDocs });
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(posts as IPost[]);
    } catch (err) {
      console.error('buildNoUserHomeFeed error', err);
    }
    setIsLoading(false);
  };

  const getUserPostVotes = () => {};

  useEffect(() => {
    if (!user && !isLoadingUser) buildNoUserHomeFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoadingUser]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {isLoading ? (
          <PostLoader />
        ) : (
          <Stack>
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                homePage={true}
                userIsCreator={user?.uid === post.creatorId}
                userVoteValue={postVotes.find((postVote) => postVote.postId === post.id)?.voteValue}
                onVote={onVote}
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
              />
            ))}
          </Stack>
        )}
      </>

      <></>
    </PageContentLayout>
  );
};

export default Home;
