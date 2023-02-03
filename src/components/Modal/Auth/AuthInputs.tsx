import { useAuthModalView } from '@/store/useAuthModalStore';
import { Flex } from '@chakra-ui/react';
import Login from './Login';
import Signup from './Signup';

const AuthInputs: React.FC = () => {
  const view = useAuthModalView();

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {view === 'login' && <Login />}
      {view === 'signup' && <Signup />}
    </Flex>
  );
};

export default AuthInputs;
