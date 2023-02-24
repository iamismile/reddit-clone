import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';

export interface ICommunity {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: 'public' | 'restricted' | 'private';
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface ICommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface ICommunityState {
  snippets: ICommunitySnippet[];
  currentCommunity: ICommunity | null;
  actions: {
    setSnippets: (snippets: ICommunitySnippet[]) => void;
    addSnippet: (snippet: ICommunitySnippet) => void;
    removeSnippet: (communityId: string) => void;
    setCurrentCommunity: (community: ICommunity | null) => void;
  };
}

const useCommunityStore = create<ICommunityState>()((set) => ({
  snippets: [],
  currentCommunity: null,
  actions: {
    setSnippets: (snippets) => set({ snippets: snippets }),
    addSnippet: (snippet) => set((state) => ({ snippets: [...state.snippets, snippet] })),
    removeSnippet: (communityId) =>
      set((state) => ({
        snippets: state.snippets.filter((snippet) => snippet.communityId !== communityId),
      })),
    setCurrentCommunity: (community) => set({ currentCommunity: community }),
  },
}));

export const useCommunitySnippets = () => useCommunityStore((state) => state.snippets);
export const useCommunityCurrentCommunity = () =>
  useCommunityStore((state) => state.currentCommunity);
export const useCommunityActions = () => useCommunityStore((state) => state.actions);
