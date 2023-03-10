import { Flex, Image } from '@chakra-ui/react';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import Directory from './Directory/Directory';
import useDirectory from '@/hooks/useDirectory';
import { defaultMenuItem } from '@/store/useDirectoryMenuStore';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  return (
    <Flex
      bg="white"
      height="48px"
      padding="6px 12px"
      justify={{ md: 'space-between' }}
      mr={{ base: 0, md: 2 }}
    >
      <Flex
        onClick={() => {
          onSelectMenuItem(defaultMenuItem);
        }}
        cursor="pointer"
        align="center"
        width={{ base: '40px', md: 'auto' }}
      >
        <Image src="/images/redditFace.svg" alt="Reddit Face" height="30px" />
        <Image
          src="/images/redditText.svg"
          alt="Reddit Text"
          height="46px"
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>

      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
