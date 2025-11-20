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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function BookingForm() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    mobile: '',
    address: '',
    modeOfPurchase: 'Own Funds',
    project: '',
    layout: '',
    plotNumber: '',
    area: '',
    totalCost: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Booking created successfully',
      description: `Booking ID: BK${Date.now().toString().slice(-3)}`,
      status: 'success',
      duration: 3000,
    });
    navigate('/bookings');
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">New Booking</Heading>
        <Button variant="outline" onClick={() => navigate('/bookings')}>
          Cancel
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Customer Details</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Customer Name</FormLabel>
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
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                />
              </FormControl>

              <Heading size="md" mt={4}>Property Details</Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Project</FormLabel>
                  <Select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  >
                    <option value="">Select Project</option>
                    <option value="Green Valley Heights">Green Valley Heights</option>
                    <option value="Silver Oak Gardens">Silver Oak Gardens</option>
                    <option value="Golden Meadows">Golden Meadows</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Layout</FormLabel>
                  <Input
                    value={formData.layout}
                    onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                    placeholder="e.g., Phase 1"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Plot Number</FormLabel>
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

                <FormControl isRequired>
                  <FormLabel>Total Cost (₹)</FormLabel>
                  <Input
                    type="number"
                    value={formData.totalCost}
                    onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                  />
                </FormControl>
              </SimpleGrid>

              <HStack justify="flex-end" mt={6}>
                <Button variant="outline" onClick={() => navigate('/bookings')}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="blue">
                  Create Booking
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
}
