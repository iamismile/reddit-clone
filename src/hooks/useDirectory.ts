import { useCommunityCurrentCommunity } from '@/store/useCommunityStore';
import {
  DirectoryMenuItem,
  useDirectoryMenuActions,
  useDirectoryMenuIsOpen,
  useDirectoryMenuSelectedMenuItem,
} from '@/store/useDirectoryMenuStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';

const useDirectory = () => {
  const isOpen = useDirectoryMenuIsOpen();
  const selectedMenuItem = useDirectoryMenuSelectedMenuItem();
  const { setIsOpen, setSelectedMenuItem } = useDirectoryMenuActions();
  const currentCommunity = useCommunityCurrentCommunity();
  const router = useRouter();

  const toggleMenuOpen = () => {
    setIsOpen(!isOpen);
  };

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setSelectedMenuItem(menuItem);
    router.push(menuItem.link);
    if (isOpen) toggleMenuOpen();
  };

  useEffect(() => {
    if (currentCommunity) {
      setSelectedMenuItem({
        displayText: `r/${currentCommunity.id}`,
        link: `/r/${currentCommunity.id}`,
        imageURL: currentCommunity.imageURL,
        icon: FaReddit,
        iconColor: 'blue.500',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCommunity]);

  return { isOpen, selectedMenuItem, toggleMenuOpen, onSelectMenuItem };
};

export default useDirectory;
