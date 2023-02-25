import useCommunityData from '@/hooks/useCommunityData';
import { ICommunity } from '@/store/useCommunityStore';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';

interface CommunityHeaderProps {
  communityData: ICommunity;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ communityData }) => {
  const { communityStateValue, isLoading, onJoinLeaveOrJoinCommunity } = useCommunityData();

  const isJoined = !!communityStateValue.snippets.find(
    (snippet) => snippet.communityId === communityData.id
  );

  return (
    <Flex direction="column" width="100%" height="144px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              src={communityData.imageURL}
              alt={communityData.id}
              borderRadius="full"
              boxSize="64px"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight="800" fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight="600" fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? 'outline' : 'solid'}
              onClick={() => onJoinLeaveOrJoinCommunity(communityData, isJoined)}
              isLoading={isLoading}
              height="30px"
              pr={6}
              pl={6}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CommunityHeader;
