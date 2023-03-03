import PageContentLayout from '@/components/Layout/PageContentLayout';
import PostItem from '@/components/Post/PostItem';
import { auth } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { useAuthState } from 'react-firebase-hooks/auth';

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { selectedPost, postVotes, onVote, onDeletePost } = usePosts();

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

      <></>
    </PageContentLayout>
  );
};

export default PostPage;
