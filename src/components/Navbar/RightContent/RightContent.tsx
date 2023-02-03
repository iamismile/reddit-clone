import AuthModal from '@/components/Modal/Auth/AuthModal';
import { Flex } from '@chakra-ui/react';
import AuthButtons from './AuthButtons';

interface RightContentProps {
  // user: string;
}

const RightContent: React.FC<RightContentProps> = () => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        <AuthButtons />{' '}
      </Flex>
    </>
  );
};

export default RightContent;
