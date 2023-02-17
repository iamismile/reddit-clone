import { Button, Flex, Input, Image, Stack } from '@chakra-ui/react';
import { useRef } from 'react';

interface ImageUploadProps {
  selectedFile?: string;
  setSelectedFile: (value: string) => void;
  setSelectedTab: (value: string) => void;
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  setSelectedFile,
  setSelectedTab,
  onSelectImage,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image src={selectedFile} alt="Upload Image" maxW="400px" maxH="400px" />
          <Stack direction="row" mt={4}>
            <Button height="20px" onClick={() => setSelectedTab('Post')}>
              Back to post
            </Button>
            <Button variant="outline" height="20px" onClick={() => setSelectedFile('')}>
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          direction="column"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button variant="outline" height="28px" onClick={() => selectedFileRef.current?.click()}>
            Upload
          </Button>
          <Input ref={selectedFileRef} type="file" hidden onChange={onSelectImage} />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
