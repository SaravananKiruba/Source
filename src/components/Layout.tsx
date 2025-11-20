import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <Flex h="100vh" overflow="hidden">
      <Sidebar />
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        <Header />
        <Box flex="1" overflow="auto" bg="gray.50" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
