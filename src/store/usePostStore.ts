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

export interface IPostVote {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
}

interface IPostState {
  selectedPost: IPost | null;
  posts: IPost[];
  postVotes: IPostVote[];
  actions: {
    setPosts: (posts: IPost[]) => void;
    setPostVotes: (postVotes: IPostVote[]) => void;
  };
}

const usePostStore = create<IPostState>()((set) => ({
  selectedPost: null,
  posts: [],
  postVotes: [],
  actions: {
    setPosts: (posts) => set({ posts }),
    setPostVotes: (postVotes) => set({ postVotes }),
  },
}));

export const usePostPosts = () => usePostStore((state) => state.posts);
export const usePostPostVotes = () => usePostStore((state) => state.postVotes);
export const usePostActions = () => usePostStore((state) => state.actions);
