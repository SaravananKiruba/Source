import { useState } from 'react';
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
  Select,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BankPaymentNotification() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    orderId: '',
    customerId: '',
    buyerName: '',
    amount: '',
    reference: '',
  });

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const handleOrderSelect = (selectedOrderId: string) => {
    setFormData({ ...formData, orderId: selectedOrderId });
    const order = orders.find((o: any) => o.id === selectedOrderId);
    if (order) {
      const primaryBuyer = order.buyers?.[0];
      setFormData({
        ...formData,
        orderId: selectedOrderId,
        customerId: order.customerId,
        buyerName: primaryBuyer?.buyerName || '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(formData.amount);
    if (amountValue < 50000) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum payment amount is ₹50,000',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const notification = {
      id: `BPN-${Date.now()}`,
      ...formData,
      amount: amountValue,
      notificationDate: new Date().toISOString(),
      notifiedBy: user?.name || 'Finance',
      createdAt: new Date().toISOString(),
    };

    const existingNotifications = JSON.parse(localStorage.getItem('bankPaymentNotifications') || '[]');
    existingNotifications.push(notification);
    localStorage.setItem('bankPaymentNotifications', JSON.stringify(existingNotifications));

    // Create payment record with realization pending status
    const payment = {
      id: `PAY-${Date.now()}`,
      orderId: formData.orderId,
      customerId: formData.customerId,
      receiptNumber: `RCP-${Date.now()}`,
      amount: amountValue,
      paymentMode: 'Bank Transfer',
      paymentDate: new Date().toISOString(),
      reference: formData.reference,
      status: 'Realization Pending',
      isRefundable: true,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Finance',
    };

    const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    existingPayments.push(payment);
    localStorage.setItem('payments', JSON.stringify(existingPayments));

    toast({
      title: 'Payment notification recorded',
      description: `Notification ID: ${notification.id}`,
      status: 'success',
      duration: 3000,
    });
    
    navigate('/payments');
  };

  if (user?.role !== 'Finance' && user?.role !== 'Admin') {
    return (
      <Box>
        <Heading size="lg" mb={4}>Bank Payment Notification</Heading>
        <Card>
          <CardBody>
            <Box textAlign="center" py={10} color="gray.500">
              You don't have permission to record bank payment notifications.
            </Box>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Record Bank Payment</Heading>
        <Button variant="outline" onClick={() => navigate('/payments')}>
          Cancel
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Payment Details</Heading>

              <FormControl isRequired>
                <FormLabel>Select Order</FormLabel>
                <Select
                  value={formData.orderId}
                  onChange={(e) => handleOrderSelect(e.target.value)}
                  placeholder="Select an order"
                >
                  {orders.map((order: any) => {
                    const primaryBuyer = order.buyers?.[0];
                    return (
                      <option key={order.id} value={order.id}>
                        {order.id} - {primaryBuyer?.buyerName} - {order.project}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              {formData.orderId && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Customer ID</FormLabel>
                    <Input value={formData.customerId} isReadOnly bg="gray.50" />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Buyer Name</FormLabel>
                    <Input value={formData.buyerName} isReadOnly bg="gray.50" />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Amount Received (₹)</FormLabel>
                    <Input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Minimum ₹50,000"
                      min="50000"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Reference / Transaction ID</FormLabel>
                    <Input
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="UTR or Transaction ID"
                    />
                  </FormControl>
                </SimpleGrid>
              )}

              <HStack justify="flex-end" mt={6}>
                <Button variant="outline" onClick={() => navigate('/payments')}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="green" isDisabled={!formData.orderId}>
                  Record Payment
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
}
