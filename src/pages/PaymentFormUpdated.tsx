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
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export default function PaymentFormUpdated() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find((o: any) => o.id === id);
  
  const [paymentMode, setPaymentMode] = useState('Razorpay');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    
    if (amountValue < 50000) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum payment amount is ₹50,000',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (paymentMode === 'Razorpay') {
      // Mock Razorpay integration
      toast({
        title: 'Payment initiated',
        description: 'Redirecting to Razorpay...',
        status: 'info',
        duration: 2000,
      });
      
      setTimeout(() => {
        const receiptNumber = `RCP-${Date.now()}`;
        
        // Save payment
        const payment = {
          id: `PAY-${Date.now()}`,
          orderId: id,
          customerId: order?.customerId,
          receiptNumber: receiptNumber,
          amount: amountValue,
          paymentMode: paymentMode,
          paymentDate: new Date().toISOString(),
          razorpayOrderId: `order_${Math.random().toString(36).substr(2, 9)}`,
          razorpayPaymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
          reference: reference,
          status: 'Success',
          isRefundable: true,
          createdAt: new Date().toISOString(),
          createdBy: user?.name || 'System',
        };
        
        const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        existingPayments.push(payment);
        localStorage.setItem('payments', JSON.stringify(existingPayments));
        
        // Show receipt with validity clause
        toast({
          title: 'Payment successful',
          description: `Receipt: ${receiptNumber} - Subject to realization`,
          status: 'success',
          duration: 5000,
        });
        
        navigate(`/orders/${id}`);
      }, 2000);
    } else {
      const receiptNumber = `RCP-${Date.now()}`;
      
      // Save payment
      const payment = {
        id: `PAY-${Date.now()}`,
        orderId: id,
        customerId: order?.customerId,
        receiptNumber: receiptNumber,
        amount: amountValue,
        paymentMode: paymentMode,
        paymentDate: new Date().toISOString(),
        chequeNumber: paymentMode === 'Cheque' ? reference : undefined,
        utrNumber: paymentMode === 'RTGS/NEFT' ? reference : undefined,
        reference: reference,
        status: paymentMode === 'Bank Transfer' ? 'Realization Pending' : 'Success',
        isRefundable: true,
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'System',
      };
      
      const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      existingPayments.push(payment);
      localStorage.setItem('payments', JSON.stringify(existingPayments));
      
      toast({
        title: 'Payment recorded',
        description: `Receipt: ${receiptNumber} - Subject to realization`,
        status: 'success',
        duration: 5000,
      });
      
      navigate(`/orders/${id}`);
    }
  };

  if (!order) {
    return <Box>Order not found</Box>;
  }

  const primaryBuyer = order.buyers?.[0];

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Record Payment</Heading>
        <Button variant="outline" onClick={() => navigate(`/orders/${id}`)}>
          Cancel
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Box bg="blue.50" p={4} borderRadius="md">
                <Heading size="sm" mb={2}>Order Details</Heading>
                <SimpleGrid columns={2} spacing={2}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600">Order ID:</Text>
                    <Text>{order.id}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600">Customer ID:</Text>
                    <Text>{order.customerId}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600">Customer:</Text>
                    <Text>{primaryBuyer?.buyerName}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600">Plot:</Text>
                    <Text>{order.plotNumber}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600">Total Cost:</Text>
                    <Text fontWeight="bold">₹{(order.totalCost / 100000).toFixed(2)}L</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <FormControl isRequired>
                <FormLabel>Payment Mode</FormLabel>
                <RadioGroup value={paymentMode} onChange={setPaymentMode}>
                  <Stack direction="column" spacing={2}>
                    <Radio value="Razorpay">Razorpay (Online)</Radio>
                    <Radio value="Cheque">Cheque</Radio>
                    <Radio value="RTGS/NEFT">RTGS/NEFT</Radio>
                    <Radio value="Cash">Cash</Radio>
                    <Radio value="Bank Transfer">Bank Transfer</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Amount (₹)</FormLabel>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Minimum ₹50,000"
                  min="50000"
                />
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Minimum payment: ₹50,000
                </Text>
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

              {(paymentMode === 'Cash' || paymentMode === 'Bank Transfer') && (
                <FormControl>
                  <FormLabel>Reference / Notes</FormLabel>
                  <Input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Optional reference"
                  />
                </FormControl>
              )}

              <Divider />

              <Alert status="info" variant="left-accent">
                <AlertIcon />
                <Box>
                  <AlertTitle>Payment Terms</AlertTitle>
                  <AlertDescription fontSize="sm">
                    • All payments are <strong>REFUNDABLE</strong> as per company policy<br />
                    • Receipt validity is <strong>subject to realization</strong> of funds<br />
                    • For cheques and bank transfers, receipt will be confirmed upon clearance<br />
                    • Minimum payment amount: ₹50,000
                  </AlertDescription>
                </Box>
              </Alert>

              <HStack justify="flex-end" mt={6}>
                <Button variant="outline" onClick={() => navigate(`/orders/${id}`)}>
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
