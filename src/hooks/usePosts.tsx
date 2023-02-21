import { usePostActions, usePostPosts } from '@/store/usePostStore';

const usePosts = () => {
  const posts = usePostPosts();
  const { setPosts } = usePostActions();

  const onVote = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async () => {};

  return {
    posts,
    setPosts,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePosts;
