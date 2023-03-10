import { firestore } from '@/firebase/clientApp';
import { IPost, usePostActions } from '@/store/usePostStore';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import CommentItem, { IComment } from './CommentItem';

interface CommentsProps {
  user?: User | null;
  selectedPost: IPost;
  communityId: string;
}

const Comments: React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<IComment[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(true);
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
      setComments((prev) => [
        { ...newComment, createdAt: { seconds: Date.now() / 1000 } as Timestamp },
        ...prev,
      ]);
      setSelectedPost({ ...selectedPost, numberOfComments: selectedPost.numberOfComments + 1 });
    } catch (err) {
      console.error('onCreateComment error', err);
    }
    setIsCreateLoading(false);
  };

  const onDeleteComment = async (comment: any) => {};

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', selectedPost.id),
        orderBy('createdAt', 'desc')
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(comments as IComment[]);
    } catch (err) {
      console.error('getPostComments error', err);
    }
    setIsFetchLoading(false);
  };

  useEffect(() => {
    getPostComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Stack spacing={6} p={2}>
        {isFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} p={6} bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing={4} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No comments yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    userId={user!.uid}
                    isDeleteLoading={false}
                    onDeleteComment={onDeleteComment}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
