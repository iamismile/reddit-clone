import { ICommunity } from '@/store/useCommunityStore';
import { Box, Button, Divider, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';

interface AboutProps {
  communityData: ICommunity;
}

const About: React.FC<AboutProps> = ({ communityData }) => {
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
        </Stack>
      </Flex>
    </Box>
  );
};

export default About;