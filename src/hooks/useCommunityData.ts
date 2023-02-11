import { auth, firestore } from '@/firebase/clientApp';
import {
  ICommunity,
  ICommunitySnippet,
  useCommunityActions,
  useCommunitySnippets,
} from '@/store/useCommunityStore';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const useCommunityData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const snippets = useCommunitySnippets();
  const { setSnippets } = useCommunityActions();

  const joinCommunity = (communityData: ICommunity) => {};
  const leaveCommunity = (communityId: string) => {};

  const onJoinLeaveOrJoinCommunity = (communityData: ICommunity, isJoined: boolean) => {
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
    } catch (err) {
      console.error('getSnippets error', err);
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
  };
};

export default useCommunityData;
