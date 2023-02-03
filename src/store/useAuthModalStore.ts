import { create } from 'zustand';

type View = 'login' | 'signup' | 'resetPassword';

export interface IAuthModalState {
  open: boolean;
  view: View;
  actions: {
    setOpen: (modalState: boolean) => void;
    setView: (view: View) => void;
  };
}

const useAuthModalStore = create<IAuthModalState>()((set) => ({
  open: false,
  view: 'login',
  actions: {
    setOpen: (modalState: boolean) => set({ open: modalState }),
    setView: (view: View) => set({ view }),
  },
}));

export const useAuthModalOpen = () => useAuthModalStore((state) => state.open);
export const useAuthModalView = () => useAuthModalStore((state) => state.view);

export const useAuthModalActions = () => useAuthModalStore((state) => state.actions);
