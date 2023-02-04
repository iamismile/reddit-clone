import { create } from 'zustand';

export type ModalView = 'login' | 'signup' | 'resetPassword';

export interface IAuthModalState {
  open: boolean;
  view: ModalView;
  actions: {
    setOpen: (modalState: boolean) => void;
    setView: (view: ModalView) => void;
  };
}

const useAuthModalStore = create<IAuthModalState>()((set) => ({
  open: false,
  view: 'login',
  actions: {
    setOpen: (modalState: boolean) => set({ open: modalState }),
    setView: (view: ModalView) => set({ view }),
  },
}));

export const useAuthModalOpen = () => useAuthModalStore((state) => state.open);
export const useAuthModalView = () => useAuthModalStore((state) => state.view);

export const useAuthModalActions = () => useAuthModalStore((state) => state.actions);
