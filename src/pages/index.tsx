import { NextPage } from 'next';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { IPost } from '@/store/usePostStore';
import PostLoader from '@/components/Post/PostLoader';
import PostItem from '@/components/Post/PostItem';
import { Stack } from '@chakra-ui/react';
import CreatePostLink from '@/components/Community/CreatePostLink';
import usePosts from '@/hooks/usePosts';
import useCommunityData from '@/hooks/useCommunityData';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, isLoadingUser] = useAuthState(auth);
  const { posts, setPosts, postVotes, onVote, onDeletePost, onSelectPost } = usePosts();
  const { communityStateValue } = useCommunityData();

  const buildUserHomeFeed = async () => {
    setIsLoading(true);
    try {
      if (communityStateValue.snippets.length) {
        // Get posts from users communities
        const communityIds = communityStateValue.snippets.map((snippet) => snippet.communityId);
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', communityIds),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(posts as IPost[]);
      } else {
        buildNoUserHomeFeed();
      }
    } catch (err) {
      console.error('buildUserHomeFeed error', err);
    }
    setIsLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setIsLoading(true);
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'),
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
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

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityStateValue.snippetsFetched]);

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
