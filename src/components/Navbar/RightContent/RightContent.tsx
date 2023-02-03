import AuthModal from '@/components/Modal/Auth/AuthModal';
import { Button, Flex } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import AuthButtons from './AuthButtons';
import { auth } from '@/firebase/clientApp';

interface RightContentProps {
  user: any;
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Button onClick={() => signOut(auth)}>Logout</Button> : <AuthButtons />}
      </Flex>
    </>
  );
};

export default RightContent;
