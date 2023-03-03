import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { ICommunity } from '@/store/useCommunityStore';
import { IPost } from '@/store/usePostStore';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

interface PostsProps {
  communityData: ICommunity;
}

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { posts, setPosts, postVotes, onVote, onDeletePost, onSelectPost } = usePosts();
  const [user] = useAuthState(auth);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc')
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(posts as IPost[]);
    } catch (err: any) {
      console.error('getPosts error', err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <PostLoader />
      ) : (
        <Stack>
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
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
  );
};

export default Posts;
