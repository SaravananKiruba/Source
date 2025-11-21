import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  SimpleGrid,
  useToast,
  HStack,
  Avatar,
  Flex,
  Text,
  Progress,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export default function CustomerBookingForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { customer, logout } = useCustomerAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    customerName: customer?.name || '',
    email: customer?.email || '',
    mobile: '',
    address: '',
    modeOfPurchase: 'Own Funds',
    project: '',
    layout: '',
    plotNumber: '',
    area: '',
    totalCost: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/customer/login');
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    const customerId = `CUST${Date.now().toString().slice(-6)}`;
    
    // Create order object with buyer details
    const order = {
      id: orderId,
      customerId: customerId,
      orderDate: new Date().toISOString(),
      project: formData.project,
      layout: formData.layout,
      plotNumber: formData.plotNumber,
      area: formData.area,
      totalCost: Math.floor(Math.random() * 5000000) + 2000000, // Mock total cost
      status: 'Order - Pending Payment',
      buyers: [
        {
          buyerName: formData.customerName,
          buyerNameInTamil: '',
          buyerType: 'Indian',
          aadhaarNumber: '',
          panNumber: '',
          passportNumber: '',
          fatherName: '',
          fatherNameInTamil: '',
          mobile: formData.mobile,
          email: formData.email,
          address: formData.address,
          aadhaarDocument: null,
          panDocument: null,
          passportDocument: null,
        }
      ],
      modeOfPurchase: formData.modeOfPurchase,
      loanRequired: formData.modeOfPurchase === 'Loan',
      isFormLocked: false,
      lockedBy: null,
      lockedAt: null,
    };
    
    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    toast({
      title: 'Order submitted successfully!',
      description: `Your Order ID is ${orderId}. Please proceed to payment.`,
      status: 'success',
      duration: 5000,
    });
    navigate(`/customer/order/${orderId}`);
  };

  const projects = [
    { name: 'Green Valley Heights', layouts: ['Phase 1', 'Phase 2'] },
    { name: 'Silver Oak Gardens', layouts: ['Phase 2', 'Phase 3'] },
    { name: 'Golden Meadows', layouts: ['Phase 1'] },
  ];

  const selectedProject = projects.find(p => p.name === formData.project);

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
        <Flex justify="space-between" align="center">
          <Heading size="md" color="blue.600">ABI Estates - New Order</Heading>
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

      <Box maxW="900px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch" mb={6}>
                <Heading size="md">Create Your Order</Heading>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Step {currentStep} of 3
                  </Text>
                  <Progress value={(currentStep / 3) * 100} colorScheme="blue" />
                </Box>
              </VStack>

              <Box as="form" onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  {currentStep === 1 && (
                    <>
                      <Heading size="sm">Personal Information</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Full Name</FormLabel>
                          <Input
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Mobile Number</FormLabel>
                          <Input
                            type="tel"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            placeholder="10-digit mobile number"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            isReadOnly
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Mode of Purchase</FormLabel>
                          <Select
                            value={formData.modeOfPurchase}
                            onChange={(e) => setFormData({ ...formData, modeOfPurchase: e.target.value })}
                          >
                            <option value="Own Funds">Own Funds</option>
                            <option value="Loan">Loan</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter your complete address"
                        />
                      </FormControl>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <Heading size="sm">Property Selection</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Project</FormLabel>
                          <Select
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value, layout: '' })}
                          >
                            <option value="">Select Project</option>
                            {projects.map(project => (
                              <option key={project.name} value={project.name}>{project.name}</option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Layout</FormLabel>
                          <Select
                            value={formData.layout}
                            onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                            isDisabled={!formData.project}
                          >
                            <option value="">Select Layout</option>
                            {selectedProject?.layouts.map(layout => (
                              <option key={layout} value={layout}>{layout}</option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Preferred Plot Number</FormLabel>
                          <Input
                            value={formData.plotNumber}
                            onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                            placeholder="e.g., P-101"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Area (sq ft)</FormLabel>
                          <Input
                            type="number"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          />
                        </FormControl>
                      </SimpleGrid>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <Heading size="sm">Review & Confirm</Heading>
                      <Card variant="outline" bg="gray.50">
                        <CardBody>
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Name:</Text>
                              <Text>{formData.customerName}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Mobile:</Text>
                              <Text>{formData.mobile}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Email:</Text>
                              <Text>{formData.email}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Purchase Mode:</Text>
                              <Text>{formData.modeOfPurchase}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Project:</Text>
                              <Text>{formData.project}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Layout:</Text>
                              <Text>{formData.layout}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Plot Number:</Text>
                              <Text>{formData.plotNumber}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Area:</Text>
                              <Text>{formData.area} sq ft</Text>
                            </Box>
                            <Box gridColumn="span 2">
                              <Text fontSize="sm" fontWeight="bold" color="gray.600">Address:</Text>
                              <Text>{formData.address}</Text>
                            </Box>
                          </SimpleGrid>
                        </CardBody>
                      </Card>

                      <Box bg="blue.50" p={4} borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" mb={2}>Next Steps:</Text>
                        <Text fontSize="sm">
                          After submitting, you'll be redirected to make the advance payment (minimum ₹50,000).
                          Our team will contact you within 24 hours to confirm your order.
                        </Text>
                      </Box>
                    </>
                  )}

                  <HStack justify="space-between" mt={6}>
                    <Button
                      variant="outline"
                      onClick={currentStep === 1 ? () => navigate('/customer/dashboard') : handlePrevious}
                    >
                      {currentStep === 1 ? 'Cancel' : 'Previous'}
                    </Button>
                    {currentStep < 3 ? (
                      <Button colorScheme="blue" onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" colorScheme="green">
                        Submit & Proceed to Payment
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </Box>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Box>
  );
}
