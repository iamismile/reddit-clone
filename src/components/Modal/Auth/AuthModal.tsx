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

const AuthModal: React.FC = () => {
  const isOpen = useAuthModalOpen();
  const view = useAuthModalView();
  const { setOpen } = useAuthModalActions();

  const onModalClose = () => {
    setOpen(false);
  };

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
              <OAuthButtons />
              <Text color="gray.400" fontWeight={700}>
                OR
              </Text>
              <AuthInputs />
              {/* <ResetPassword /> */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
