import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function CustomerLogin() {
  const { customer, loginWithGoogle, setBookingToken } = useCustomerAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const bookingToken = searchParams.get('token');

  useEffect(() => {
    if (customer) {
      if (bookingToken) {
        setBookingToken(bookingToken);
        navigate('/customer/booking');
      } else {
        navigate('/customer/dashboard');
      }
    }
  }, [customer, bookingToken, navigate, setBookingToken]);

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      toast({
        title: 'Login successful',
        description: 'Welcome to ABI Estates',
        status: 'success',
        duration: 2000,
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="md" py={20}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" color="blue.600">ABI Estates</Heading>
            <Text fontSize="lg" fontWeight="semibold">Customer Portal</Text>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              {bookingToken 
                ? 'Login to complete your property booking'
                : 'Login to view your bookings and make payments'
              }
            </Text>
            
            <Button
              size="lg"
              w="full"
              leftIcon={<Icon as={FcGoogle} boxSize={6} />}
              onClick={handleGoogleLogin}
              variant="outline"
              borderColor="gray.300"
              bg="white"
              color="gray.700"
              fontWeight="semibold"
              _hover={{ bg: 'gray.50', borderColor: 'gray.400' }}
            >
              Continue with Google
            </Button>

            <Box bg="blue.50" p={4} borderRadius="md" w="full">
              <Text fontSize="xs" fontWeight="bold" mb={2}>Demo Mode:</Text>
              <Text fontSize="xs">
                Click "Continue with Google" to simulate Google OAuth login.
                In production, this would use real Google OAuth.
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}
