import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  SimpleGrid,
  Avatar,
  Flex,
  useToast,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiPhone, FiDownload } from 'react-icons/fi';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const customerOrders = orders.filter((order: any) => {
    const primaryBuyer = order.buyers?.[0];
    return primaryBuyer?.buyerEmail === customer?.email;
  });

  // Orders eligible for parent document download (selected by CRM)
  const eligibleOrdersForPD = JSON.parse(localStorage.getItem('eligibleParentDocOrders') || '[]');

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const handleCallCRM = () => {
    const crmPhone = '+91-9876543210'; // Mock CRM phone
    toast({
      title: 'Calling CRM',
      description: `Initiating call to ${crmPhone}`,
      status: 'info',
      duration: 3000,
    });
    // In real scenario: window.location.href = `tel:${crmPhone}`;
  };

  const handleDownloadParentDoc = (orderId: string) => {
    // Find plot details
    const order = orders.find((o: any) => o.id === orderId);
    const plots = JSON.parse(localStorage.getItem('plots') || '[]');
    const plot = plots.find((p: any) => p.plotNumber === order?.plotNumber);
    
    if (plot && plot.pdGoogleDriveLocation) {
      window.open(plot.pdGoogleDriveLocation, '_blank');
      toast({
        title: 'Opening Parent Document',
        description: 'Document will open in a new tab',
        status: 'success',
        duration: 2000,
      });
    } else {
      toast({
        title: 'Document not available',
        description: 'Parent document link is not configured',
        status: 'warning',
        duration: 3000,
      });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
        <Flex justify="space-between" align="center">
          <Heading size="md" color="blue.600">ABI Estates - Customer Portal</Heading>
          <HStack>
            <Avatar size="sm" name={customer?.name} src={customer?.picture} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="bold">{customer?.name}</Text>
              <Text fontSize="xs" color="gray.600">{customer?.email}</Text>
            </VStack>
            <Button size="sm" colorScheme="red" variant="outline" onClick={handleLogout}>Logout</Button>
          </HStack>
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">My Dashboard</Heading>
            <Tooltip label="Call CRM for assistance">
              <Button
                leftIcon={<FiPhone />}
                colorScheme="green"
                onClick={handleCallCRM}
              >
                Call CRM
              </Button>
            </Tooltip>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.600">Total Orders</Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  {customerOrders.length}
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.600">Pending Payments</Text>
                <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                  {customerOrders.filter(o => o.status === 'Order - Pending Payment').length}
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.600">Completed</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">
                  {customerOrders.filter(o => o.status === 'Order - Completed').length}
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>My Orders</Heading>
              {customerOrders.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text color="gray.500" mb={4}>No bookings yet</Text>
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate('/customer/booking')}
                  >
                    Create New Booking
                  </Button>
                </Box>
              ) : (
                <VStack align="stretch" spacing={4}>
                  {customerOrders.map(order => {
                    const orderPayments = payments.filter((p: any) => p.orderId === order.id && p.status === 'Success');
                    const totalPaid = orderPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
                    const primaryBuyer = order.buyers?.[0];
                    const isEligibleForPD = eligibleOrdersForPD.includes(order.id);
                    
                    return (
                      <Card key={order.id} variant="outline">
                        <CardBody>
                          <Flex justify="space-between" align="start">
                            <Box flex="1">
                              <HStack mb={2}>
                                <Heading size="sm">{order.project}</Heading>
                                <Badge
                                  colorScheme={
                                    order.status === 'Order - Completed' ? 'green' :
                                    order.status === 'Order - Payment Confirmed' ? 'blue' :
                                    order.status === 'Order - In Progress' ? 'yellow' : 'orange'
                                  }
                                >
                                  {order.status?.replace('Order - ', '')}
                                </Badge>
                              </HStack>
                              <HStack mb={1}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.600">Order ID:</Text>
                                <Text fontSize="xs">{order.id}</Text>
                                <Text fontSize="xs" fontWeight="bold" color="gray.600">Customer ID:</Text>
                                <Text fontSize="xs">{order.customerId}</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                Plot: {order.plotNumber} | Area: {order.area} sq ft
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Order Date: {format(new Date(order.orderDate), 'dd MMM yyyy')}
                              </Text>
                              <Text fontSize="lg" fontWeight="bold" color="green.600" mt={2}>
                                Total: ₹{(order.totalCost / 100000).toFixed(2)}L
                              </Text>
                              {totalPaid > 0 && (
                                <Text fontSize="sm" color="green.600" mt={1}>
                                  Paid: ₹{(totalPaid / 100000).toFixed(2)}L
                                </Text>
                              )}
                            </Box>
                            <VStack>
                              {isEligibleForPD && (
                                <Tooltip label="Download Parent Document">
                                  <IconButton
                                    icon={<FiDownload />}
                                    aria-label="Download Parent Document"
                                    colorScheme="purple"
                                    size="sm"
                                    onClick={() => handleDownloadParentDoc(order.id)}
                                  />
                                </Tooltip>
                              )}
                              <Button
                                size="sm"
                                onClick={() => navigate(`/customer/order/${order.id}`)}
                              >
                                View Details
                              </Button>
                              {order.status === 'Order - Pending Payment' && (
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => navigate(`/customer/payment/${order.id}`)}
                                >
                                  Make Payment
                                </Button>
                              )}
                            </VStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    );
                  })}
                </VStack>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Box>
  );
}
