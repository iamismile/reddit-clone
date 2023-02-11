import { Flex } from '@chakra-ui/react';

interface PageContentLayoutProps {
  children: [React.ReactNode, React.ReactNode];
}

const PageContentLayout: React.FC<PageContentLayoutProps> = ({ children }) => {
  return (
    <Flex justify="center" padding="16px 0px" border="1px solid red">
      <Flex width="95%" justify="center" maxWidth="860px" border="1px solid green">
        {/* LHS */}
        <Flex
          direction="column"
          width={{ base: '100%', md: '65%' }}
          mr={{ base: 0, md: 6 }}
          border="1px solid blue"
        >
          {children[0]}
        </Flex>

        {/* RHS */}
        <Flex
          direction="column"
          display={{ base: 'none', md: 'flex' }}
          flexGrow={1}
          border="1px solid green"
        >
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContentLayout;
