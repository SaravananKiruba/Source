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
  Text,
  useToast,
  PinInput,
  PinInputField,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginWithOTP() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpMethod, setOtpMethod] = useState<'google' | 'mobile' | 'aadhaar'>('google');

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    
    if (success) {
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
      });
      navigate('/');
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const sendOTP = () => {
    if (otpMethod === 'google' && !email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        status: 'warning',
        duration: 2000,
      });
      return;
    }
    
    if (otpMethod === 'mobile' && !mobile) {
      toast({
        title: 'Mobile number required',
        description: 'Please enter your mobile number',
        status: 'warning',
        duration: 2000,
      });
      return;
    }
    
    if (otpMethod === 'aadhaar' && !aadhaar) {
      toast({
        title: 'Aadhaar number required',
        description: 'Please enter your Aadhaar number',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    setOtpSent(true);
    toast({
      title: 'OTP sent successfully',
      description: `OTP has been sent to your ${otpMethod === 'google' ? 'email' : otpMethod === 'mobile' ? 'mobile' : 'registered mobile'}`,
      status: 'success',
      duration: 3000,
    });
  };

  const verifyOTP = () => {
    if (otp === '123456') {
      // Mock OTP verification - in real scenario, verify with backend
      let loginEmail = email;
      
      // For mobile/aadhaar, map to a known account for demo
      if (otpMethod === 'mobile' && mobile) {
        loginEmail = 'admin@abiestates.com';
      } else if (otpMethod === 'aadhaar' && aadhaar) {
        loginEmail = 'admin@abiestates.com';
      }
      
      const success = login(loginEmail, 'admin123'); // Mock password for OTP login
      
      if (success) {
        toast({
          title: 'OTP verified successfully',
          status: 'success',
          duration: 2000,
        });
        navigate('/');
      }
    } else {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Card maxW="500px" w="full">
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" color="blue.600">ABI Estates</Heading>
            <Text color="gray.600">Staff Portal Login</Text>

            <Tabs width="100%" colorScheme="blue" onChange={() => setOtpSent(false)}>
              <TabList>
                <Tab>Email & Password</Tab>
                <Tab>OTP Login</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Box as="form" onSubmit={handlePasswordLogin}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@abiestates.com"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label="Toggle password"
                              icon={showPassword ? <FiEyeOff /> : <FiEye />}
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button type="submit" colorScheme="blue" width="full" size="lg">
                        Login
                      </Button>

                      <Box bg="blue.50" p={3} borderRadius="md" width="full">
                        <Text fontSize="xs" fontWeight="bold" mb={1}>Demo Credentials:</Text>
                        <Text fontSize="xs">Admin: admin@abiestates.com / admin123</Text>
                        <Text fontSize="xs">CRM: crm@abiestates.com / crm123</Text>
                        <Text fontSize="xs">Finance: finance@abiestates.com / finance123</Text>
                        <Text fontSize="xs">Business Owner: businessowner@abiestates.com / owner123</Text>
                      </Box>
                    </VStack>
                  </Box>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <Tabs width="100%" size="sm" variant="enclosed" onChange={(index) => {
                      setOtpSent(false);
                      setOtp('');
                      setOtpMethod(index === 0 ? 'google' : index === 1 ? 'mobile' : 'aadhaar');
                    }}>
                      <TabList>
                        <Tab>Google OTP</Tab>
                        <Tab>Mobile OTP</Tab>
                        <Tab>Aadhaar OTP</Tab>
                      </TabList>

                      <TabPanels>
                        <TabPanel>
                          <VStack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Gmail Address</FormLabel>
                              <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@gmail.com"
                              />
                            </FormControl>
                          </VStack>
                        </TabPanel>

                        <TabPanel>
                          <VStack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Mobile Number</FormLabel>
                              <Input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="10-digit mobile number"
                                maxLength={10}
                              />
                            </FormControl>
                          </VStack>
                        </TabPanel>

                        <TabPanel>
                          <VStack spacing={4}>
                            <FormControl isRequired>
                              <FormLabel>Aadhaar Number</FormLabel>
                              <Input
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value)}
                                placeholder="XXXX-XXXX-XXXX"
                                maxLength={14}
                              />
                            </FormControl>
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>

                    {!otpSent ? (
                      <Button colorScheme="blue" width="full" onClick={sendOTP}>
                        Send OTP
                      </Button>
                    ) : (
                      <VStack spacing={4} width="full">
                        <FormControl>
                          <FormLabel textAlign="center">Enter 6-digit OTP</FormLabel>
                          <HStack justify="center">
                            <PinInput value={otp} onChange={setOtp} size="lg">
                              <PinInputField />
                              <PinInputField />
                              <PinInputField />
                              <PinInputField />
                              <PinInputField />
                              <PinInputField />
                            </PinInput>
                          </HStack>
                        </FormControl>

                        <Button colorScheme="green" width="full" onClick={verifyOTP}>
                          Verify OTP
                        </Button>

                        <Button variant="link" size="sm" onClick={sendOTP}>
                          Resend OTP
                        </Button>

                        <Box bg="orange.50" p={2} borderRadius="md" width="full">
                          <Text fontSize="xs" textAlign="center">Demo OTP: 123456</Text>
                        </Box>
                      </VStack>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
