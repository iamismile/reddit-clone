import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    // Needs to use setDoc, coz we don't know
    // user is login or signing up
    // if user is login then user data will update
    // otherwise new user will create
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

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
