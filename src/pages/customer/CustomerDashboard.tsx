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
} from '@chakra-ui/react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useNavigate } from 'react-router-dom';
import { mockBookings, mockPayments } from '../../data/mockData';
import { format } from 'date-fns';

export default function CustomerDashboard() {
  const { customer, logout } = useCustomerAuth();
  const navigate = useNavigate();

  // Get bookings from localStorage and mockData
  const savedBookings = JSON.parse(localStorage.getItem('customerBookings') || '[]');
  const savedPayments = JSON.parse(localStorage.getItem('customerPayments') || '[]');
  const customerBookings = [
    ...mockBookings.filter(b => b.email === customer?.email || b.email === 'rajesh.kumar@email.com'),
    ...savedBookings.filter((b: any) => b.email === customer?.email)
  ];

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
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
          <Heading size="lg">My Dashboard</Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.600">Total Bookings</Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  {customerBookings.length}
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.600">Pending Payments</Text>
                <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                  {customerBookings.filter(b => b.status === 'Booked - Pending Payment').length}
                </Text>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Text fontSize="sm" color="gray.600">Completed</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">
                  {customerBookings.filter(b => b.status === 'Booked - Payment Confirmed').length}
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>My Bookings</Heading>
              {customerBookings.length === 0 ? (
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
                  {customerBookings.map(booking => {
                    const payment = mockPayments.find(p => p.bookingId === booking.id) 
                      || savedPayments.find((p: any) => p.bookingId === booking.id);
                    
                    return (
                      <Card key={booking.id} variant="outline">
                        <CardBody>
                          <Flex justify="space-between" align="start">
                            <Box flex="1">
                              <HStack mb={2}>
                                <Heading size="sm">{booking.project}</Heading>
                                <Badge
                                  colorScheme={
                                    booking.status === 'Booked - Payment Confirmed' ? 'green' : 'orange'
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                Plot: {booking.plotNumber} | Area: {booking.area} sq ft
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Booking Date: {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
                              </Text>
                              <Text fontSize="lg" fontWeight="bold" color="green.600" mt={2}>
                                Total: ₹{(booking.totalCost / 100000).toFixed(2)}L
                              </Text>
                              {payment && (
                                <Text fontSize="sm" color="green.600" mt={1}>
                                  Paid: ₹{(payment.amount / 100000).toFixed(2)}L
                                </Text>
                              )}
                            </Box>
                            <VStack>
                              <Button
                                size="sm"
                                onClick={() => navigate(`/customer/booking/${booking.id}`)}
                              >
                                View Details
                              </Button>
                              {booking.status === 'Booked - Pending Payment' && (
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => navigate(`/customer/payment/${booking.id}`)}
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
