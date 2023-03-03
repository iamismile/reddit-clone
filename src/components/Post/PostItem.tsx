import { IPost } from '@/store/usePostStore';
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from 'react-icons/io5';

interface PostItemProps {
  post: IPost;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: IPost,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: IPost) => Promise<boolean>;
  onSelectPost?: (post: IPost) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isImageDeleteLoading, setIsImageDeleteLoading] = useState(false);
  const router = useRouter();

  const singlePostPage = !onSelectPost;

  const handleDeletePost = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setIsImageDeleteLoading(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error('Failed to delete post');
      }
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (err: any) {
      console.error('handleDeletePost error', err.message);
      setError(true);
    }
    setIsImageDeleteLoading(false);
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? 'white' : 'gray.300'}
      borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
      cursor={singlePostPage ? 'unset' : 'pointer'}
      _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? 'none' : 'gray.100'}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? '0px' : '3px 0px 0px 3px'}
      >
        <Icon
          as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
          color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
          fontSize={22}
          cursor="pointer"
          onClick={(e) => onVote(e, post, 1, post.communityId)}
        />
        <Text fontSize="9pt">{post.voteStatus}</Text>
        <Icon
          as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
          color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
          fontSize={22}
          cursor="pointer"
          onClick={(e) => onVote(e, post, -1, post.communityId)}
        />
      </Flex>

      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {/* Home Page Check */}

            <Text>
              Posted by u/{post.creatorDisplayName}{' '}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>

          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>

          <Text fontSize="10pt">{post.body}</Text>

          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {isImageLoading && <Skeleton height="200px" width="100%" borderRadius={4} />}
              <Image
                src={post.imageURL}
                alt={post.title}
                width="100%"
                maxWidth="460px"
                display={isImageLoading ? 'none' : 'unset'}
                onLoad={() => setIsImageLoading(false)}
              />
            </Flex>
          )}
        </Stack>

        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            cursor="pointer"
            _hover={{ bg: 'gray.200' }}
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            cursor="pointer"
            _hover={{ bg: 'gray.200' }}
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            cursor="pointer"
            _hover={{ bg: 'gray.200' }}
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              cursor="pointer"
              _hover={{ bg: 'gray.200' }}
              onClick={handleDeletePost}
            >
              {isImageDeleteLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
