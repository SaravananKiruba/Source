import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  HStack,
  SimpleGrid,
  useToast,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { mockBookings } from '../data/mockData';

export default function PaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const booking = mockBookings.find(b => b.id === id);
  
  const [paymentMode, setPaymentMode] = useState('Razorpay');
  const [amount, setAmount] = useState(booking ? (booking.totalCost * 0.1).toString() : '');
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMode === 'Razorpay') {
      // Mock Razorpay integration
      toast({
        title: 'Payment initiated',
        description: 'Redirecting to Razorpay...',
        status: 'info',
        duration: 2000,
      });
      
      setTimeout(() => {
        toast({
          title: 'Payment successful',
          description: `Receipt Number: RCP-${Date.now()}`,
          status: 'success',
          duration: 3000,
        });
        navigate(`/bookings/${id}`);
      }, 2000);
    } else {
      toast({
        title: 'Payment recorded',
        description: `Receipt Number: RCP-${Date.now()}`,
        status: 'success',
        duration: 3000,
      });
      navigate(`/bookings/${id}`);
    }
  };

  if (!booking) {
    return <Box>Booking not found</Box>;
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Record Payment - {booking.id}</Heading>
        <Button variant="outline" onClick={() => navigate(`/bookings/${id}`)}>
          Cancel
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Box bg="blue.50" p={4} borderRadius="md">
                <Heading size="sm" mb={2}>Booking Details</Heading>
                <SimpleGrid columns={2} spacing={2}>
                  <Box>Customer: {booking.customerName}</Box>
                  <Box>Plot: {booking.plotNumber}</Box>
                  <Box>Total Cost: ₹{(booking.totalCost / 100000).toFixed(2)}L</Box>
                </SimpleGrid>
              </Box>

              <FormControl isRequired>
                <FormLabel>Payment Mode</FormLabel>
                <RadioGroup value={paymentMode} onChange={setPaymentMode}>
                  <Stack direction="row" spacing={4}>
                    <Radio value="Razorpay">Razorpay (Online)</Radio>
                    <Radio value="Cheque">Cheque</Radio>
                    <Radio value="RTGS/NEFT">RTGS/NEFT</Radio>
                    <Radio value="Cash">Cash</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Amount (₹)</FormLabel>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>

              {paymentMode === 'Cheque' && (
                <FormControl isRequired>
                  <FormLabel>Cheque Number</FormLabel>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Enter cheque number"
                  />
                </FormControl>
              )}

              {paymentMode === 'RTGS/NEFT' && (
                <FormControl isRequired>
                  <FormLabel>UTR Number</FormLabel>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Enter UTR number"
                  />
                </FormControl>
              )}

              {paymentMode === 'Cash' && (
                <FormControl>
                  <FormLabel>Reference / Notes</FormLabel>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Optional reference"
                  />
                </FormControl>
              )}

              <HStack justify="flex-end" mt={6}>
                <Button variant="outline" onClick={() => navigate(`/bookings/${id}`)}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="green">
                  {paymentMode === 'Razorpay' ? 'Proceed to Razorpay' : 'Record Payment'}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
}
