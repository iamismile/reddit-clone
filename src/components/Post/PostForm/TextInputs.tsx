import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

interface TextInputsProps {
  textInputs: {
    title: string;
    body: string;
  };
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreatePost: () => Promise<void>;
}

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  loading,
  onChange,
  handleCreatePost,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        value={textInputs.title}
        onChange={onChange}
        placeholder="Title"
        name="title"
        fontSize="10pt"
        borderRadius={4}
        _placeholder={{ color: 'gray.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Textarea
        value={textInputs.body}
        onChange={onChange}
        placeholder="Text (optional)"
        name="body"
        fontSize="10pt"
        borderRadius={4}
        height="100px"
        _placeholder={{ color: 'gray.500' }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'black',
        }}
      />
      <Flex justify="flex-end">
        <Button
          isLoading={loading}
          isDisabled={!textInputs.title}
          height="34px"
          p="0px 30px"
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInputs;
