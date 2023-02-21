import { Timestamp } from 'firebase/firestore';
import { create } from 'zustand';

export interface IPost {
  id: string;
  communityId: string;
  communityImageURL?: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  createdAt: Timestamp;
}

interface IPostState {
  selectedPost: IPost | null;
  posts: IPost[];
  actions: {
    setPosts: (posts: IPost[]) => void;
  };
}

const usePostStore = create<IPostState>()((set) => ({
  selectedPost: null,
  posts: [],
  actions: {
    setPosts: (posts) => set({ posts }),
  },
}));

export const usePostPosts = () => usePostStore((state) => state.posts);
export const usePostActions = () => usePostStore((state) => state.actions);
