import useDirectory from '@/hooks/useDirectory';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList, Text, Image } from '@chakra-ui/react';
import Communities from './Communities';

const Directory: React.FC = () => {
  const { isOpen, selectedMenuItem, toggleMenuOpen } = useDirectory();

  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        onClick={toggleMenuOpen}
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex justify="space-between" align="center" width={{ base: 'auto', lg: '200px' }}>
          <Flex align="center">
            {selectedMenuItem.imageURL ? (
              <Image
                src={selectedMenuItem.imageURL}
                alt={selectedMenuItem.displayText}
                borderRadius="full"
                boxSize="24px"
                mr={2}
              />
            ) : (
              <Icon as={selectedMenuItem.icon} fontSize={24} mr={{ base: 1, md: 2 }} />
            )}
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontSize="10pt" fontWeight={600}>
                {selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};

export default Directory;
