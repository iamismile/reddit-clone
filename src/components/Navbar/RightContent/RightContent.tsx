import AuthModal from '@/components/Modal/Auth/AuthModal';
import { Flex } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import AuthButtons from './AuthButtons';
import Icons from './Icons';

interface RightContentProps {
  user?: User | null;
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <Icons /> : <AuthButtons />}
      </Flex>
    </>
  );
};

export default RightContent;
