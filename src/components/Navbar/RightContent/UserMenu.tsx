import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { signOut, User } from 'firebase/auth';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogin, MdOutlineLogout } from 'react-icons/md';
import { FaRedditSquare } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';
import { auth } from '@/firebase/clientApp';
import { useAuthModalActions } from '@/store/useAuthModalStore';

interface UserMenuProps {
  user?: User | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { setOpen, setView } = useAuthModalActions();

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon as={FaRedditSquare} fontSize={24} mr={1} color="gray.200" />
                <Flex
                  direction="column"
                  display={{ base: 'none', lg: 'flex' }}
                  fontSize="8pt"
                  align="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>{user?.displayName || user.email?.split('@')[0]}</Text>
                  <Flex>
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">1 karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon as={VscAccount} fontSize={24} color="gray.400" mr={1} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: 'blue.500',
                color: 'white',
              }}
            >
              <Flex align="center">
                <Icon as={CgProfile} fontSize={20} mr={2} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: 'blue.500',
                color: 'white',
              }}
              onClick={() => signOut(auth)}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogout} fontSize={20} mr={2} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{
                bg: 'blue.500',
                color: 'white',
              }}
              onClick={() => {
                setOpen(true);
                setView('login');
              }}
            >
              <Flex align="center">
                <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;