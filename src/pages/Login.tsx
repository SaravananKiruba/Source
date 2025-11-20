import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
      });
      navigate('/');
    } else {
      toast({
        title: 'Invalid credentials',
        description: 'Please check your email and password',
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
            <Text fontSize="sm" color="gray.600">Booking & Registration Management</Text>
            
            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@abiestates.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" w="full" mt={4}>
                  Login
                </Button>
              </VStack>
            </Box>

            <Box bg="gray.50" p={4} borderRadius="md" w="full">
              <Text fontSize="xs" fontWeight="bold" mb={2}>Demo Credentials:</Text>
              <Text fontSize="xs">Admin: admin@abiestates.com / admin123</Text>
              <Text fontSize="xs">Sales: sales@abiestates.com / sales123</Text>
              <Text fontSize="xs">Accounts: accounts@abiestates.com / accounts123</Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
}
