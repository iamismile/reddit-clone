import { firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import { IPost } from '@/store/usePostStore';
import { Alert, AlertIcon, Flex, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IconType } from 'react-icons';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import ImageUpload from './PostForm/ImageUpload';
import TextInputs from './PostForm/TextInputs';
import TabItem from './TabItem';

export interface ITabItem {
  title: string;
  icon: IconType;
}

const formTabs: ITabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

interface NewPostFormProps {
  user: User;
  communityImageURL?: string;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageURL }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({
    title: '',
    body: '',
  });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleCreatePost = async () => {
    setIsLoading(true);
    // Store post into db
    const { communityId } = router.query;
    const newPost: Omit<IPost, 'id'> = {
      communityId: communityId as string,
      communityImageURL: communityImageURL || '',
      creatorId: user.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInput.title,
      body: textInput.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

      // Check selectedFile
      if (selectedFile) {
        // store into firebase storage
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);

        // update post doc by adding image url
        await updateDoc(postDocRef, { imageURL: downloadURL });
      }

      // Redirect to the community page
      router.back();
    } catch (err: any) {
      console.error('handleCreatePost error', err.message);
      setError(true);
    }
    setIsLoading(false);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInput((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInput}
            loading={isLoading}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
