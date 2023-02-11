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

interface ICommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface ICommunityState {
  snippets: ICommunitySnippet[];
  actions: {
    setSnippets: (snippets: ICommunitySnippet[]) => void;
    addSnippet: (snippet: ICommunitySnippet) => void;
    removeSnippet: (communityId: string) => void;
  };
}

const useCommunityStore = create<ICommunityState>()((set) => ({
  snippets: [],
  actions: {
    setSnippets: (snippets) => set({ snippets: snippets }),
    addSnippet: (snippet) => set((state) => ({ snippets: [...state.snippets, snippet] })),
    removeSnippet: (communityId) =>
      set((state) => ({
        snippets: state.snippets.filter((snippet) => snippet.communityId !== communityId),
      })),
  },
}));

export const useCommunitySnippets = () => useCommunityStore((state) => state.snippets);
export const useCommunityActions = () => useCommunityStore((state) => state.actions);
