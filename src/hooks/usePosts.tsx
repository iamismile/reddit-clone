import { firestore, storage } from '@/firebase/clientApp';
import { IPost, usePostActions, usePostPosts } from '@/store/usePostStore';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const usePosts = () => {
  const posts = usePostPosts();
  const { setPosts } = usePostActions();

  const onVote = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async (post: IPost): Promise<boolean> => {
    try {
      // If image exist delete image
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // Delete post document
      const postDocRef = doc(firestore, 'posts', post.id);
      await deleteDoc(postDocRef);

      // Update posts store
      setPosts(posts.filter((item) => item.id !== post.id));
      return true;
    } catch (err: any) {
      console.error('onDeletePost error', err.message);
      return false;
    }
  };

  return {
    posts,
    setPosts,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePosts;
