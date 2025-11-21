import { Box, VStack, Text, Icon, Flex, Divider } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiDollarSign, 
  FiLink,
  FiMapPin,
  FiSend,
  FiCreditCard,
  FiBarChart2
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/', icon: FiHome, label: 'Dashboard' },
  { path: '/orders', icon: FiFileText, label: 'Orders', permission: 'view-orders' },
  { path: '/plots', icon: FiMapPin, label: 'Plot Management', permission: 'manage-plots' },
];

const crmMenuItems = [
  { path: '/send-payment-link', icon: FiSend, label: 'Send Payment Link', permission: 'send-payment-link' },
  { path: '/generate-link', icon: FiLink, label: 'Generate Order Link', permission: 'create-order' },
];

const financeMenuItems = [
  { path: '/bank-payment', icon: FiCreditCard, label: 'Bank Payment', permission: 'record-bank-payment' },
];

const reportsMenuItems = [
  { path: '/reports/in-progress', icon: FiBarChart2, label: 'In-Progress Orders', permission: 'view-reports' },
];

export default function Sidebar() {
  const location = useLocation();
  const { hasPermission } = useAuth();

  return (
    <Box w="250px" bg="blue.700" color="white" p={4} overflowY="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center" color="white">
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
                color="white"
              >
                <Icon as={item.icon} mr={3} color="white" />
                <Text color="white">{item.label}</Text>
              </Flex>
            </Link>
          );
        })}

        {crmMenuItems.some(item => !item.permission || hasPermission(item.permission)) && (
          <>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Text fontSize="xs" fontWeight="bold" px={3} mb={2} color="blue.200">
              CRM TOOLS
            </Text>
            {crmMenuItems.map((item) => {
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
                    color="white"
                  >
                    <Icon as={item.icon} mr={3} color="white" />
                    <Text fontSize="sm" color="white">{item.label}</Text>
                  </Flex>
                </Link>
              );
            })}
          </>
        )}

        {financeMenuItems.some(item => !item.permission || hasPermission(item.permission)) && (
          <>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Text fontSize="xs" fontWeight="bold" px={3} mb={2} color="blue.200">
              FINANCE
            </Text>
            {financeMenuItems.map((item) => {
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
                    color="white"
                  >
                    <Icon as={item.icon} mr={3} color="white" />
                    <Text fontSize="sm" color="white">{item.label}</Text>
                  </Flex>
                </Link>
              );
            })}
          </>
        )}

        {reportsMenuItems.some(item => !item.permission || hasPermission(item.permission)) && (
          <>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Text fontSize="xs" fontWeight="bold" px={3} mb={2} color="blue.200">
              REPORTS
            </Text>
            {reportsMenuItems.map((item) => {
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
                    color="white"
                  >
                    <Icon as={item.icon} mr={3} color="white" />
                    <Text fontSize="sm" color="white">{item.label}</Text>
                  </Flex>
                </Link>
              );
            })}
          </>
        )}
      </VStack>
    </Box>
  );
}
