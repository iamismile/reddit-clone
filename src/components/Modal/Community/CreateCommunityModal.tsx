import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import useDirectory from '@/hooks/useDirectory';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';

interface CreateCommunityModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open, handleClose }) => {
  const [communityName, setCommunityName] = useState('');
  const [charRemaining, setCharRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAuthState(auth);
  const { toggleMenuOpen } = useDirectory();
  const { addSnippet } = useCommunityData();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setCharRemaining(21 - e.target.value.length);
  };

  const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError('');
    // Validate the community name
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        'Community names must be between 3-21 characters, and can only contain letters, numbers or underscores.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const communityDocRef = doc(firestore, 'communities', communityName);
      await runTransaction(firestore, async (transaction) => {
        // Check the name is not taken
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`Sorry r/${communityName} is already taken. Try another.`);
        }

        // If valid name, create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        // Create community snippet on user
        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
          communityId: communityName,
          isModerator: true,
        });
      });

      handleClose();
      toggleMenuOpen();
      addSnippet({ communityId: communityName, isModerator: true, imageURL: '' });
      setCommunityName('');
      router.push(`/r/${communityName}`);
    } catch (err: any) {
      console.error('handleCreateCommunity error', err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={open} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={15} padding={3}>
          Create a community
        </ModalHeader>
        <ModalCloseButton />

        <Box pl={3} pr={3}>
          <ModalBody display="flex" flexDirection="column" padding="10px 0px">
            <Text fontSize={15} fontWeight={600}>
              Name
            </Text>
            <Text fontSize={11} color="gray.500">
              Community names including capitalization cannot be changed
            </Text>
            <Text position="relative" top="28px" left="10px" width="20px" color="gray.400">
              r/
            </Text>
            <Input
              type="text"
              value={communityName}
              onChange={handleChange}
              size="sm"
              pl="22px"
              position="relative"
            />
            <Text fontSize="9pt" color={charRemaining === 0 ? 'red' : 'gray.500'}>
              {charRemaining} Characters remaining
            </Text>
            <Text fontSize="9pt" color="red" pt={1}>
              {error}
            </Text>
            <Box mt={4} mb={4}>
              <Text fontSize={15} fontWeight={600}>
                Community Type
              </Text>
              <Stack spacing={2}>
                <Checkbox
                  name="public"
                  isChecked={communityType === 'public'}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr={1}>
                      Public
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Anyone can view, post and comment to this community
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="restricted"
                  isChecked={communityType === 'restricted'}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr={1}>
                      Restricted
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Anyone can view this community, but only approved users can post
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="private"
                  isChecked={communityType === 'private'}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={HiLockClosed} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr={1}>
                      Private
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Only approved users can view and submit to this community
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
        </Box>

        <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
          <Button onClick={handleClose} variant="outline" mr={3} height="30px">
            Cancel
          </Button>
          <Button onClick={handleCreateCommunity} isLoading={isLoading} height="30px">
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateCommunityModal;
