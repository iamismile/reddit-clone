import { useAuthModalActions } from '@/store/useAuthModalStore';
import { Button } from '@chakra-ui/react';

const AuthButtons: React.FC = () => {
  const { setOpen, setView } = useAuthModalActions();

  return (
    <>
      <Button
        variant="outline"
        height="28px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => {
          setOpen(true);
          setView('login');
        }}
      >
        Log in
      </Button>
      <Button
        height="28px"
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => {
          setOpen(true);
          setView('signup');
        }}
      >
        Sign up
      </Button>
    </>
  );
};

export default AuthButtons;
