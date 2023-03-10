import { auth } from '@/firebase/clientApp';
import useDirectory from '@/hooks/useDirectory';
import { useAuthModalActions } from '@/store/useAuthModalStore';
import { Flex, Icon, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsLink45Deg } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { IoImageOutline } from 'react-icons/io5';

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { setOpen, setView } = useAuthModalActions();
  const { toggleMenuOpen } = useDirectory();

  const onClick = () => {
    if (!user) {
      setOpen(true);
      setView('login');
      return;
    }

    const { communityId } = router.query;
    if (communityId) {
      router.push(`/r/${communityId}/submit`);
      return;
    }

    toggleMenuOpen();
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      border="1px solid"
      borderRadius={4}
      borderColor="gray.300"
      p={2}
      mb={4}
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create post"
        fontSize="10pt"
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        _hover={{
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        onClick={onClick}
      />
      <Icon as={IoImageOutline} fontSize={24} color="gray.400" mr={4} />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" />
    </Flex>
  );
};

export default CreatePostLink;
