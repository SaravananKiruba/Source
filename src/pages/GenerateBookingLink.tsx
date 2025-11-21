import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  Input,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Code,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FiCopy, FiSend, FiLink } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function GenerateBookingLink() {
  const [customerEmail, setCustomerEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const toast = useToast();
  const { hasPermission } = useAuth();

  if (!hasPermission('create-order')) {
    return (
      <Box>
        <Text>You don't have permission to generate order links.</Text>
      </Box>
    );
  }

  const handleGenerateLink = () => {
    if (!customerEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter customer email',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const token = `ORL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get the base URL and path for the application
    const baseUrl = window.location.origin;
    const basePath = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash
    
    // For HashRouter, we need to include the hash (#) before the route
    const link = `${baseUrl}${basePath}/#/customer/login?token=${token}`;
    
    setGeneratedLink(link);
    
    toast({
      title: 'Order link generated',
      description: 'Copy and share with customer',
      status: 'success',
      duration: 3000,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: 'Link copied!',
      description: 'Booking link copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  const handleSendEmail = () => {
    // Mock email sending
    toast({
      title: 'Email sent!',
      description: `Order link sent to ${customerEmail}`,
      status: 'success',
      duration: 3000,
    });
    
    // Reset form
    setCustomerEmail('');
    setGeneratedLink('');
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Generate Customer Order Link</Heading>

      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="sm" color="gray.600" mb={4}>
                Generate a unique order link for customers to complete their property order online.
                Customers will login with Google/Mobile/Aadhaar OTP and can fill the order form and make payments themselves.
              </Text>
            </Box>

            <HStack spacing={4}>
              <Input
                placeholder="Enter customer email address"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                size="lg"
              />
              <Button
                leftIcon={<FiLink />}
                colorScheme="blue"
                onClick={handleGenerateLink}
                size="lg"
              >
                Generate Link
              </Button>
            </HStack>

            {generatedLink && (
              <>
                <Divider />
                
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Generated Order Link:
                  </Text>
                  <InputGroup size="lg">
                    <Input
                      value={generatedLink}
                      isReadOnly
                      bg="gray.50"
                    />
                    <InputRightElement width="auto" px={2}>
                      <Button
                        size="sm"
                        leftIcon={<FiCopy />}
                        onClick={handleCopyLink}
                      >
                        Copy
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Box>

                <Box bg="blue.50" p={4} borderRadius="md">
                  <Text fontSize="sm" fontWeight="bold" mb={2}>Link Details:</Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Text fontSize="sm">Customer Email:</Text>
                      <Code fontSize="sm">{customerEmail}</Code>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Status:</Text>
                      <Badge colorScheme="green">Active</Badge>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm">Valid Until:</Text>
                      <Text fontSize="sm">30 days</Text>
                    </HStack>
                  </VStack>
                </Box>

                <HStack>
                  <Button
                    leftIcon={<FiSend />}
                    colorScheme="green"
                    onClick={handleSendEmail}
                    flex="1"
                  >
                    Send via Email
                  </Button>
                  <Button
                    leftIcon={<FiCopy />}
                    variant="outline"
                    onClick={handleCopyLink}
                    flex="1"
                  >
                    Copy Link
                  </Button>
                </HStack>

                <Box bg="orange.50" p={4} borderRadius="md">
                  <Text fontSize="xs" fontWeight="bold" mb={1}>Email Template Preview:</Text>
                  <Text fontSize="xs" color="gray.700">
                    <strong>Subject:</strong> Complete Your Property Order - ABI Estates<br /><br />
                    Dear Customer,<br /><br />
                    Thank you for your interest in ABI Estates. Please use the link below to complete your property order online:<br /><br />
                    <Code fontSize="xs">{generatedLink}</Code><br /><br />
                    You'll be able to:<br />
                    • Fill in your order details and buyer information<br />
                    • Upload required documents (Aadhaar, PAN, Passport)<br />
                    • Review property information<br />
                    • Make advance payment securely (minimum ₹50,000)<br /><br />
                    Link expires in 30 days.<br /><br />
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
