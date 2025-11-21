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
  useToast,
  Text,
  Code,
  Badge,
  Divider,
  Select,
} from '@chakra-ui/react';
import { FiSend, FiCopy } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function SendPaymentLink() {
  const { user } = useAuth();
  const toast = useToast();
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const handleOrderSelect = (selectedOrderId: string) => {
    setOrderId(selectedOrderId);
    const order = orders.find((o: any) => o.id === selectedOrderId);
    if (order) {
      setCustomerId(order.customerId);
      const primaryBuyer = order.buyers?.[0];
      setCustomerEmail(primaryBuyer?.buyerEmail || '');
    }
  };

  const handleGenerateLink = () => {
    if (!orderId || !customerEmail || !amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

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

    const token = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const baseUrl = window.location.origin;
    const basePath = window.location.pathname.replace(/\/$/, '');
    const link = `${baseUrl}${basePath}/#/customer/payment/${orderId}?token=${token}&amount=${amountValue}`;
    
    setGeneratedLink(link);

    // Save payment link
    const paymentLink = {
      id: `PL-${Date.now()}`,
      orderId,
      customerId,
      customerEmail,
      amount: amountValue,
      linkUrl: link,
      generatedBy: user?.name || 'CRM',
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'Active',
    };

    const existingLinks = JSON.parse(localStorage.getItem('paymentLinks') || '[]');
    existingLinks.push(paymentLink);
    localStorage.setItem('paymentLinks', JSON.stringify(existingLinks));

    toast({
      title: 'Payment link generated',
      description: 'Link is ready to send',
      status: 'success',
      duration: 3000,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Link copied!',
      description: 'Payment link copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  const handleSendEmail = () => {
    toast({
      title: 'Email sent!',
      description: `Payment link sent to ${customerEmail}`,
      status: 'success',
      duration: 3000,
    });
    
    // Reset form
    setOrderId('');
    setCustomerId('');
    setCustomerEmail('');
    setAmount('');
    setGeneratedLink('');
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Send Payment Link</Heading>

      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Generate and send a payment link to customers for pending payments. Minimum amount: ₹50,000
            </Text>

            <FormControl isRequired>
              <FormLabel>Select Order</FormLabel>
              <Select
                value={orderId}
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

            {orderId && (
              <>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Customer ID</FormLabel>
                    <Input value={customerId} isReadOnly bg="gray.50" />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Customer Email</FormLabel>
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Payment Amount (₹)</FormLabel>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Minimum ₹50,000"
                      min="50000"
                    />
                  </FormControl>
                </SimpleGrid>

                <Button
                  colorScheme="blue"
                  onClick={handleGenerateLink}
                  size="lg"
                >
                  Generate Payment Link
                </Button>
              </>
            )}

            {generatedLink && (
              <>
                <Divider />
                
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Generated Payment Link:
                  </Text>
                  <HStack>
                    <Input
                      value={generatedLink}
                      isReadOnly
                      bg="gray.50"
                      size="sm"
                    />
                    <Button
                      size="sm"
                      leftIcon={<FiCopy />}
                      onClick={handleCopyLink}
                    >
                      Copy
                    </Button>
                  </HStack>
                </Box>

                <Box bg="blue.50" p={4} borderRadius="md">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>Link Details:</Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Text fontSize="sm">Order ID:</Text>
                      <Code fontSize="sm">{orderId}</Code>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Customer ID:</Text>
                      <Code fontSize="sm">{customerId}</Code>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Amount:</Text>
                      <Text fontSize="sm" fontWeight="bold">₹{parseFloat(amount).toLocaleString()}</Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Status:</Text>
                      <Badge colorScheme="green">Active</Badge>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Valid For:</Text>
                      <Text fontSize="sm">7 days</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Button
                  leftIcon={<FiSend />}
                  colorScheme="green"
                  onClick={handleSendEmail}
                  size="lg"
                >
                  Send via Email
                </Button>

                <Box bg="orange.50" p={4} borderRadius="md">
                  <Text fontSize="xs" fontWeight="bold" mb={1}>Email Template Preview:</Text>
                  <Text fontSize="xs" color="gray.700">
                    <strong>Subject:</strong> Payment Link for Your Order - ABI Estates<br /><br />
                    Dear Customer,<br /><br />
                    Please use the link below to complete your payment of ₹{amount}:<br /><br />
                    <Code fontSize="xs">{generatedLink}</Code><br /><br />
                    Order ID: {orderId}<br />
                    Customer ID: {customerId}<br /><br />
                    This link is valid for 7 days.<br /><br />
                    Best regards,<br />
                    ABI Estates Team
                  </Text>
                </Box>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

import { SimpleGrid } from '@chakra-ui/react';
