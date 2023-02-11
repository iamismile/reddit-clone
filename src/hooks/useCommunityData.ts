import { auth, firestore } from '@/firebase/clientApp';
import { useAuthModalActions } from '@/store/useAuthModalStore';
import {
  ICommunity,
  ICommunitySnippet,
  useCommunityActions,
  useCommunitySnippets,
} from '@/store/useCommunityStore';
import { collection, doc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const useCommunityData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const snippets = useCommunitySnippets();
  const { setSnippets, addSnippet, removeSnippet } = useCommunityActions();
  const { setOpen, setView } = useAuthModalActions();

  const joinCommunity = async (communityData: ICommunity) => {
    setIsLoading(true);
    try {
      // Create a new community snippet
      const batch = writeBatch(firestore);
      const newSnippet = {
        communityId: communityData.id,
        isModerator: false,
        imageURL: communityData.imageURL || '',
      };
      const communitySnippetRef = doc(
        firestore,
        `users/${user?.uid}/communitySnippets`,
        communityData.id
      );
      batch.set(communitySnippetRef, newSnippet);

      // Update the number of members
      const communityRef = doc(firestore, 'communities', communityData.id);
      batch.update(communityRef, { numberOfMembers: increment(1) });

      await batch.commit();

      // Update community store
      addSnippet(newSnippet);
    } catch (err: any) {
      console.error('joinCommunity error', err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    setIsLoading(true);
    try {
      // Delete community snippet
      const batch = writeBatch(firestore);
      const communitySnippetRef = doc(
        firestore,
        `users/${user?.uid}/communitySnippets`,
        communityId
      );
      batch.delete(communitySnippetRef);

      // Update the number of members
      const communityRef = doc(firestore, 'communities', communityId);
      batch.update(communityRef, { numberOfMembers: increment(-1) });

      await batch.commit();

      // Update community store
      removeSnippet(communityId);
    } catch (err: any) {
      console.error('leaveCommunity error', err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  const onJoinLeaveOrJoinCommunity = (communityData: ICommunity, isJoined: boolean) => {
    // When there is no user open auth modal
    if (!user) {
      setOpen(true);
      setView('login');
      return;
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }

    joinCommunity(communityData);
  };

  const getSnippets = async () => {
    setIsLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() })) as ICommunitySnippet[];
      setSnippets(snippets);
    } catch (err: any) {
      console.error('getSnippets error', err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getSnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    communityStateValue: { snippets },
    onJoinLeaveOrJoinCommunity,
    isLoading,
    error,
  };
};

export default useCommunityData;
