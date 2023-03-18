import React from 'react';
import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useAuthModalActions } from '@/store/useAuthModalStore';
import useDirectory from '@/hooks/useDirectory';

const PersonalHome: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { setOpen, setView } = useAuthModalActions();
  const { toggleMenuOpen } = useDirectory();

  const onClickCreatePost = () => {
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

  const onClickCreateCommunity = () => {
    if (!user) {
      setOpen(true);
      setView('login');
      return;
    }
    toggleMenuOpen();
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/redditPersonalHome.png)"
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={FaReddit} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600}>Home</Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt">Your personal Reddit front page, built for you.</Text>
          <Button onClick={onClickCreatePost} height="30px">
            Create Post
          </Button>
          <Button onClick={onClickCreateCommunity} variant="outline" height="30px">
            Create Community
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default PersonalHome;
