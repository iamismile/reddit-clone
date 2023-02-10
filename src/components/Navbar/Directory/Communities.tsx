import CreateCommunityModal from '@/components/Modal/Community/CreateCommunityModal';
import { Flex, Icon, MenuItem } from '@chakra-ui/react';
import { useState } from 'react';
import { GrAdd } from 'react-icons/gr';

const Communities: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
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
    </>
  );
};

export default Communities;
