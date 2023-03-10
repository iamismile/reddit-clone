import { Flex, Icon, MenuItem, Image } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface MenuListItemProps {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
}

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}) => {
  return (
    <MenuItem onClick={() => {}} width="100%" fontSize="10pt" _hover={{ bg: 'gray.100' }}>
      <Flex align="center">
        {imageURL ? (
          <Image src={imageURL} alt={displayText} borderRadius="full" boxSize="18px" mr={2} />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export default MenuListItem;
