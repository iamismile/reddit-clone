import About from '@/components/Community/About';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import PostItem from '@/components/Post/PostItem';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { IPost } from '@/store/usePostStore';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const PostPage: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { selectedPost, setSelectedPost, postVotes, onVote, onDeletePost } = usePosts();
  const { communityStateValue } = useCommunityData();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postDocRef);
      setSelectedPost({ id: postDoc.id, ...postDoc.data() } as IPost);
    } catch (err: any) {
      console.error('fetchPost error', err.message);
    }
  };

  useEffect(() => {
    const { pid } = router.query;
    if (pid && !selectedPost) {
      fetchPost(pid as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, selectedPost]);

  return (
    <PageContentLayout>
      <>
        {selectedPost && (
          <PostItem
            post={selectedPost}
            userIsCreator={user?.uid === selectedPost.creatorId}
            userVoteValue={
              postVotes.find((postVote) => postVote.postId === selectedPost.id)?.voteValue
            }
            onVote={onVote}
            onDeletePost={onDeletePost}
          />
        )}
      </>

      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContentLayout>
  );
};

export default PostPage;
