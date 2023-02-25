import { auth, firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import {
  ICommunity,
  useCommunityActions,
  useCommunityCurrentCommunity,
} from '@/store/useCommunityStore';
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Stack,
  Spinner,
  Text,
  Input,
} from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import moment from 'moment';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';

interface AboutProps {
  communityData: ICommunity;
}

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const { setCurrentCommunity } = useCommunityActions();
  const selectedFileRef = useRef<HTMLInputElement>(null);

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setIsImageUploading(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, 'data_url');

      const downloadUrl = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, 'communities', communityData.id), { imageURL: downloadUrl });
      setCurrentCommunity({ ...communityData, imageURL: downloadUrl });
      setSelectedFile(undefined);
    } catch (err: any) {
      console.error('onUpdateImage error', err.message);
    }
    setIsImageUploading(false);
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>

      <Flex direction="column" bg="white" p={3} borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex align="center" width="100%" p={1} fontWeight={500} fontSize="10pt">
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{' '}
                {moment(new Date(communityData.createdAt.seconds * 1000)).format('MMM DD, YYYY')}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height="30px" width="100%">
              Create post
            </Button>
          </Link>

          {communityData.creatorId === user?.uid && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      alt={communityData.id}
                      borderRadius="full"
                      boxSize="40px"
                    />
                  ) : (
                    <Icon as={FaReddit} fontSize={40} color="brand.100" mr={2} />
                  )}
                </Flex>
                {selectedFile && isImageUploading && <Spinner />}
                {selectedFile && !isImageUploading && (
                  <Text cursor="pointer" onClick={onUpdateImage}>
                    Save Changes
                  </Text>
                )}
                <Input ref={selectedFileRef} type="file" hidden onChange={onSelectFile} />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;
