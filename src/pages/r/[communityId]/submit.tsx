import PageContentLayout from '@/components/Layout/PageContentLayout';
import NewPostForm from '@/components/Post/NewPostForm';
import { Box, Text } from '@chakra-ui/react';

const SubmitPostPage: React.FC = () => {
  return (
    <PageContentLayout>
      <>
        <Box p="14px 0" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        <NewPostForm />
      </>
      <>About</>
    </PageContentLayout>
  );
};

export default SubmitPostPage;
