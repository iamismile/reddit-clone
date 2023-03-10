import CreateCommunityModal from '@/components/Modal/Community/CreateCommunityModal';
import { useCommunitySnippets } from '@/store/useCommunityStore';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import { GrAdd } from 'react-icons/gr';
import MenuListItem from './MenuListItem';

const Communities: React.FC = () => {
  const [open, setOpen] = useState(false);
  const snippets = useCommunitySnippets();

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {snippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              iconColor="brand.100"
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          onClick={() => setOpen(true)}
          width="100%"
          fontSize="10pt"
          _hover={{ bg: 'gray.100' }}
        >
          <Flex align="center">
            <Icon as={GrAdd} fontSize={20} mr={2} />
            Create Community
          </Flex>
        </MenuItem>
        {snippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            iconColor="blue.500"
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
