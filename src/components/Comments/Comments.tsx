import { firestore } from '@/firebase/clientApp';
import { IPost, usePostActions } from '@/store/usePostStore';
import { Box, Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CommentInput from './CommentInput';

interface CommentsProps {
  user?: User | null;
  selectedPost: IPost;
  communityId: string;
}

export interface IComment {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
}

const Comments: React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<IComment[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const { setSelectedPost } = usePostActions();

  const onCreateComment = async (commentText: string) => {
    if (!user) return;

    setIsCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(collection(firestore, 'comments'));
      const newComment: IComment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        communityId,
        postId: selectedPost.id,
        postTitle: selectedPost.title,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(commentDocRef, newComment);

      const postDocRef = doc(firestore, 'posts', selectedPost.id);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      setCommentText('');
      setComments((prev) => [newComment, ...prev]);
      setSelectedPost({ ...selectedPost, numberOfComments: selectedPost.numberOfComments + 1 });
    } catch (err) {
      console.error('onCreateComment error', err);
    }
    setIsCreateLoading(false);
  };

  const onDeleteComment = async (comment: any) => {};

  const getPostComments = async () => {};

  useEffect(() => {
    getPostComments();
  }, []);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex direction="column" pl={10} pr={4} mb={6} fontSize="10pt" width="100%">
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          isCreateLoading={isCreateLoading}
          onCreateComment={onCreateComment}
        />
      </Flex>
    </Box>
  );
};

export default Comments;
