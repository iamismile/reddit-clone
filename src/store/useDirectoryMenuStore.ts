import { IconType } from 'react-icons';
import { TiHome } from 'react-icons/ti';
import { create } from 'zustand';

export interface DirectoryMenuItem {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
}

interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: DirectoryMenuItem;
  actions: {
    setIsOpen: (value: boolean) => void;
    setSelectedMenuItem: (menuItem: DirectoryMenuItem) => void;
  };
}

export const defaultMenuItem = {
  displayText: 'Home',
  link: '/',
  icon: TiHome,
  iconColor: 'black',
};

const useDirectoryMenuStore = create<DirectoryMenuState>()((set) => ({
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
  actions: {
    setIsOpen: (value: boolean) => set({ isOpen: value }),
    setSelectedMenuItem: (menuItem: DirectoryMenuItem) => set({ selectedMenuItem: menuItem }),
  },
}));

export const useDirectoryMenuIsOpen = () => useDirectoryMenuStore((state) => state.isOpen);
export const useDirectoryMenuSelectedMenuItem = () =>
  useDirectoryMenuStore((state) => state.selectedMenuItem);

export const useDirectoryMenuActions = () => useDirectoryMenuStore((state) => state.actions);
