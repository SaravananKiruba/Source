import { Box, VStack, Text, Icon, Flex, Divider } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiClipboard, 
  FiCalendar, 
  FiActivity,
  FiLink
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/', icon: FiHome, label: 'Dashboard' },
  { path: '/bookings', icon: FiFileText, label: 'Bookings' },
  { path: '/registrations', icon: FiClipboard, label: 'Registrations' },
  { path: '/slots', icon: FiCalendar, label: 'Slot Management' },
  { path: '/audit-logs', icon: FiActivity, label: 'Audit Logs' },
];

const customerMenuItems = [
  { path: '/generate-link', icon: FiLink, label: 'Generate Booking Link', permission: 'create-booking' },
];

export default function Sidebar() {
  const location = useLocation();
  const { hasPermission } = useAuth();

  return (
    <Box w="250px" bg="blue.700" color="white" p={4} overflowY="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
        ABI Estates
      </Text>
      
      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link key={item.path} to={item.path}>
              <Flex
                align="center"
                p={3}
                borderRadius="md"
                bg={isActive ? 'blue.600' : 'transparent'}
                _hover={{ bg: 'blue.600' }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} mr={3} />
                <Text>{item.label}</Text>
              </Flex>
            </Link>
          );
        })}

        <Divider my={4} />

        <Text fontSize="xs" fontWeight="bold" px={3} mb={2} color="blue.200">
          CUSTOMER PORTAL
        </Text>

        {customerMenuItems.map((item) => {
          if (item.permission && !hasPermission(item.permission)) return null;
          
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Flex
                align="center"
                p={3}
                borderRadius="md"
                bg={isActive ? 'blue.600' : 'transparent'}
                _hover={{ bg: 'blue.600' }}
                transition="all 0.2s"
              >
                <Icon as={item.icon} mr={3} />
                <Text fontSize="sm">{item.label}</Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
}
