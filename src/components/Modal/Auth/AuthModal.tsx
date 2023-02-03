import { useAuthModalOpen, useAuthModalActions } from '@/store/useAuthModalStore';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { fstat } from 'fs';

const AuthModal: React.FC = () => {
  const isOpen = useAuthModalOpen();
  const { setOpen } = useAuthModalActions();

  const onModalClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Here is the modal body</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
