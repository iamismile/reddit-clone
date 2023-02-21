import { firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { ICommunity } from '@/store/useCommunityStore';
import { IPost } from '@/store/usePostStore';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface PostsProps {
  communityData: ICommunity;
}

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPosts } = usePosts();

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

  return <div>posts</div>;
};

export default Posts;
