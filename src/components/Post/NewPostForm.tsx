import { Flex } from '@chakra-ui/react';
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

const NewPostForm: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({
    title: '',
    body: '',
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePost = async () => {};

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.addEventListener('load', (readEvent) => {
      if (readEvent.target?.result) {
        setSelectedFile(readEvent.target.result as string);
      }
    });
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
            onSelectImage={onSelectImage}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default NewPostForm;
