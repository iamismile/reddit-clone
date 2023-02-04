import { useAuthModalActions, useAuthModalOpen, useAuthModalView } from '@/store/useAuthModalStore';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useEffect } from 'react';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
  const isOpen = useAuthModalOpen();
  const view = useAuthModalView();
  const { setOpen } = useAuthModalActions();
  const [user, loading, error] = useAuthState(auth);

  const onModalClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (user) onModalClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {view === 'login' && 'Login'}
            {view === 'signup' && 'Sign Up'}
            {view === 'resetPassword' && 'Reset Password'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            pb={6}
          >
            <Flex direction="column" justify="center" align="center" width="70%">
              {view === 'resetPassword' ? (
                <ResetPassword />
              ) : (
                <>
                  <OAuthButtons />
                  <Text color="gray.400" fontWeight={700}>
                    OR
                  </Text>
                  <AuthInputs />
                </>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
