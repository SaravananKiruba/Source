import { Flex, Text, Button, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Text fontSize="lg" fontWeight="semibold" color="gray.700">
        Booking & Registration Management System
      </Text>

      <Menu>
        <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="ghost">
          <Flex align="center" gap={2}>
            <Avatar size="sm" name={user?.name} />
            <Text fontSize="sm">{user?.name} ({user?.role})</Text>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
