import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  VStack,
  Heading,
  HStack,
  Text,
  Avatar,
  Flex,
  useToast,
  SimpleGrid,
  Divider,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { mockBookings } from '../../data/mockData';
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa';

export default function CustomerPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { customer, logout } = useCustomerAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const booking = mockBookings.find(b => b.id === id);
  const advanceAmount = booking ? booking.totalCost * 0.1 : 0;

  useEffect(() => {
    if (!customer) {
      navigate('/customer/login');
    }
  }, [customer, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const handleRazorpayPayment = () => {
    setProcessing(true);

    // Mock Razorpay payment flow
    toast({
      title: 'Initiating payment...',
      description: 'Opening Razorpay payment gateway',
      status: 'info',
      duration: 2000,
    });

    setTimeout(() => {
      // Simulate successful payment
      setProcessing(false);
      setPaymentComplete(true);
      
      toast({
        title: 'Payment successful!',
        description: `Receipt No: RCP-${Date.now()}`,
        status: 'success',
        duration: 4000,
      });
    }, 3000);
  };

  if (!booking) {
    return (
      <Box minH="100vh" bg="gray.50" p={6}>
        <Card maxW="600px" mx="auto">
          <CardBody>
            <Text>Booking not found</Text>
            <Button mt={4} onClick={() => navigate('/customer/dashboard')}>
              Go to Dashboard
            </Button>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
        <Flex justify="space-between" align="center">
          <Heading size="md" color="blue.600">ABI Estates - Payment</Heading>
          <HStack>
            <Avatar size="sm" name={customer?.name} src={customer?.picture} />
            <VStack align="start" spacing={0}>
              <Text fontSize="sm" fontWeight="bold">{customer?.name}</Text>
              <Text fontSize="xs" color="gray.600">{customer?.email}</Text>
            </VStack>
            <Button size="sm" onClick={handleLogout}>Logout</Button>
          </HStack>
        </Flex>
      </Box>

      <Box maxW="800px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          {!paymentComplete ? (
            <>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Booking Advance Payment</Heading>
                  
                  <Box bg="blue.50" p={4} borderRadius="md" mb={4}>
                    <Text fontSize="sm" fontWeight="bold" mb={2}>Booking Details</Text>
                    <SimpleGrid columns={2} spacing={3}>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Booking ID</Text>
                        <Text fontWeight="bold">{booking.id}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Customer Name</Text>
                        <Text fontWeight="bold">{booking.customerName}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Project</Text>
                        <Text fontWeight="bold">{booking.project}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Plot Number</Text>
                        <Text fontWeight="bold">{booking.plotNumber}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Area</Text>
                        <Text fontWeight="bold">{booking.area} sq ft</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="gray.600">Total Cost</Text>
                        <Text fontWeight="bold" color="green.600">
                          ₹{(booking.totalCost / 100000).toFixed(2)}L
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Divider my={4} />

                  <Box>
                    <Heading size="sm" mb={3}>Payment Summary</Heading>
                    <VStack align="stretch" spacing={3}>
                      <Flex justify="space-between">
                        <Text>Booking Advance (10%)</Text>
                        <Text fontWeight="bold">₹{(advanceAmount / 100000).toFixed(2)}L</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontSize="sm" color="gray.600">GST & Other Charges</Text>
                        <Text fontSize="sm" color="gray.600">Included</Text>
                      </Flex>
                      <Divider />
                      <Flex justify="space-between" align="center">
                        <Text fontSize="xl" fontWeight="bold">Total Payable</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="green.600">
                          ₹{(advanceAmount / 100000).toFixed(2)}L
                        </Text>
                      </Flex>
                    </VStack>
                  </Box>

                  <Box mt={6} p={4} bg="orange.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" mb={1}>Payment Terms:</Text>
                    <Text fontSize="xs">
                      • Booking advance is non-refundable<br />
                      • Receipt will be generated immediately after payment<br />
                      • Balance payment as per milestone schedule<br />
                      • Our team will contact you within 24 hours
                    </Text>
                  </Box>

                  <VStack spacing={3} mt={6}>
                    <Button
                      size="lg"
                      w="full"
                      colorScheme="blue"
                      leftIcon={<Icon as={FaCreditCard} />}
                      onClick={handleRazorpayPayment}
                      isLoading={processing}
                      loadingText="Processing Payment..."
                    >
                      Pay ₹{(advanceAmount / 100000).toFixed(2)}L with Razorpay
                    </Button>
                    
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Secure payment powered by Razorpay • All major cards accepted
                    </Text>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/customer/dashboard')}
                    >
                      Pay Later
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              <Card variant="outline">
                <CardBody>
                  <Heading size="sm" mb={3}>Why Razorpay?</Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box textAlign="center">
                      <Text fontWeight="bold" fontSize="sm">Secure</Text>
                      <Text fontSize="xs" color="gray.600">256-bit SSL encryption</Text>
                    </Box>
                    <Box textAlign="center">
                      <Text fontWeight="bold" fontSize="sm">Fast</Text>
                      <Text fontSize="xs" color="gray.600">Instant confirmation</Text>
                    </Box>
                    <Box textAlign="center">
                      <Text fontWeight="bold" fontSize="sm">Trusted</Text>
                      <Text fontSize="xs" color="gray.600">PCI DSS compliant</Text>
                    </Box>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </>
          ) : (
            <Card>
              <CardBody>
                <VStack spacing={6} py={6}>
                  <Icon as={FaCheckCircle} boxSize={16} color="green.500" />
                  <Heading size="lg" color="green.600">Payment Successful!</Heading>
                  
                  <Box bg="green.50" p={4} borderRadius="md" w="full">
                    <SimpleGrid columns={2} spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Receipt Number</Text>
                        <Text fontWeight="bold">RCP-{Date.now()}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Amount Paid</Text>
                        <Text fontWeight="bold" color="green.600">
                          ₹{(advanceAmount / 100000).toFixed(2)}L
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Payment Method</Text>
                        <Text fontWeight="bold">Razorpay</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Status</Text>
                        <Badge colorScheme="green">Confirmed</Badge>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Box bg="blue.50" p={4} borderRadius="md" w="full">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>What's Next?</Text>
                    <Text fontSize="sm">
                      ✓ Payment receipt sent to your email<br />
                      ✓ Booking confirmed with ID: {booking.id}<br />
                      ✓ Our team will contact you within 24 hours<br />
                      ✓ You can track your booking in the dashboard
                    </Text>
                  </Box>

                  <HStack spacing={4}>
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate('/customer/dashboard')}
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.print()}
                    >
                      Download Receipt
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
