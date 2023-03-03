import { auth, firestore } from '@/firebase/clientApp';
import { useAuthModalActions } from '@/store/useAuthModalStore';
import {
  ICommunity,
  ICommunitySnippet,
  useCommunityActions,
  useCommunityCurrentCommunity,
  useCommunitySnippets,
} from '@/store/useCommunityStore';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const useCommunityData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const router = useRouter();
  const snippets = useCommunitySnippets();
  const currentCommunity = useCommunityCurrentCommunity();
  const { setSnippets, addSnippet, removeSnippet, setCurrentCommunity } = useCommunityActions();
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

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, 'communities', communityId);
      const communityDoc = await getDoc(communityDocRef);
      setCurrentCommunity({ id: communityDoc.id, ...communityDoc.data() } as ICommunity);
    } catch (err: any) {
      console.error('getCommunityData error', err.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setSnippets([]);
      return;
    }
    getSnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;
    if (communityId && !currentCommunity) {
      getCommunityData(communityId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, currentCommunity]);

  return {
    communityStateValue: { snippets, currentCommunity },
    onJoinLeaveOrJoinCommunity,
    setCurrentCommunity,
    isLoading,
    error,
  };
};

export default useCommunityData;
