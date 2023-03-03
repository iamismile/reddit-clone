import { auth, firestore, storage } from '@/firebase/clientApp';
import { useAuthModalActions } from '@/store/useAuthModalStore';
import { useCommunityCurrentCommunity } from '@/store/useCommunityStore';
import {
  IPost,
  IPostVote,
  usePostActions,
  usePostPosts,
  usePostPostVotes,
} from '@/store/usePostStore';
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const usePosts = () => {
  const posts = usePostPosts();
  const postVotes = usePostPostVotes();
  const currentCommunity = useCommunityCurrentCommunity();
  const { setPosts, setPostVotes } = usePostActions();
  const { setOpen, setView } = useAuthModalActions();
  const [user] = useAuthState(auth);

  const onVote = async (post: IPost, vote: number, communityId: string) => {
    // When there is no user open auth modal
    if (!user?.uid) {
      setOpen(true);
      setView('login');
      return;
    }

    try {
      const existingPostVote = postVotes.find((postVote) => postVote.postId === post.id);

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...posts];
      let updatedPostVotes = [...postVotes];
      let voteChange = vote;

      // Create a new postVote if there is no existing postVote
      if (!existingPostVote) {
        const newPostVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`));
        const newVote: IPostVote = {
          id: newPostVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote, // 1 or -1
        };
        batch.set(newPostVoteRef, newVote);

        updatedPost.voteStatus += vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        // Existing vote - they have voted on the post before
        // Remove or update post vote for existing postVote
        const existingPostVoteRef = doc(
          firestore,
          'users',
          `${user?.uid}/postVotes/${existingPostVote.id}`
        );
        // Remove vote if previous vote and current vote value matches
        if (existingPostVote.voteValue === vote) {
          updatedPost.voteStatus = post.voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (postVote) => postVote.id !== existingPostVote.id
          );

          batch.delete(existingPostVoteRef);
          voteChange *= -1;
        } else {
          // Flipping their vote
          updatedPost.voteStatus = post.voteStatus + 2 * vote;
          const postVoteIndex = postVotes.findIndex(
            (postVote) => postVote.id === existingPostVote.id
          );
          updatedPostVotes[postVoteIndex] = {
            ...existingPostVote,
            voteValue: vote,
          };
          batch.update(existingPostVoteRef, { voteValue: vote });
          voteChange = 2 * vote;
        }
      }

      const postRef = doc(firestore, 'posts', post.id);
      batch.update(postRef, { voteStatus: post.voteStatus + voteChange });

      await batch.commit();

      // Update states
      const postIndex = posts.findIndex((item) => item.id === post.id);
      updatedPosts[postIndex] = updatedPost;
      setPosts(updatedPosts);
      setPostVotes(updatedPostVotes);
    } catch (err: any) {
      console.error('onVote error', err.message);
    }
  };

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

  const getCommunityPostVotes = async (communityId: string) => {
    const postVoteQuery = query(
      collection(firestore, 'users', `${user?.uid}/postVotes`),
      where('communityId', '==', communityId)
    );
    const postVoteDocs = await getDocs(postVoteQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setPostVotes(postVotes as IPostVote[]);
  };

  // When there is user and community id
  // get user postVotes of that community
  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentCommunity]);

  // when user gets logout
  // clear user post votes
  useEffect(() => {
    if (!user) {
      setPostVotes([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    posts,
    setPosts,
    postVotes,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePosts;
