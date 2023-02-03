import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button variant="oauth" mb={2} isLoading={loading} onClick={() => signInWithGoogle()}>
        <Image src="/images/googlelogo.png" alt="Google Logo" height="20px" mr={4} />
        Continue with Google
      </Button>
      <Button variant="oauth">Some other provider</Button>
      {error && (
        <Text fontSize="10pt" textAlign="center" color="red">
          {error.message}
        </Text>
      )}
    </Flex>
  );
};

export default OAuthButtons;
