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
  VStack,
  Heading,
  HStack,
  SimpleGrid,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { mockBookings } from '../data/mockData';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    bookingId: '',
    preferredRegDate: '',
    documentCount: '3',
    language: 'English',
    buyerName: '',
    buyerAge: '',
    aadhaar: '',
    pan: '',
    parentName: '',
    buyerAddress: '',
    buyerMobile: '',
    buyerEmail: '',
    paymentMode: 'Own Funds',
    bankName: '',
    bankBranch: '',
    loanAmount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Registration request created',
      description: `Request ID: REG${Date.now().toString().slice(-3)}`,
      status: 'success',
      duration: 3000,
    });
    navigate('/registrations');
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">New Registration Request</Heading>
        <Button variant="outline" onClick={() => navigate('/registrations')}>
          Cancel
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Request Details</Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Booking ID</FormLabel>
                  <Select
                    value={formData.bookingId}
                    onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                  >
                    <option value="">Select Booking</option>
                    {mockBookings.filter(b => b.status === 'Booked - Payment Confirmed').map(b => (
                      <option key={b.id} value={b.id}>{b.id} - {b.customerName}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Preferred Registration Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.preferredRegDate}
                    onChange={(e) => setFormData({ ...formData, preferredRegDate: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Number of Documents</FormLabel>
                  <Input
                    type="number"
                    value={formData.documentCount}
                    onChange={(e) => setFormData({ ...formData, documentCount: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Language</FormLabel>
                  <Select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <Heading size="md" mt={4}>Buyer Details</Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Buyer Name</FormLabel>
                  <Input
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    value={formData.buyerAge}
                    onChange={(e) => setFormData({ ...formData, buyerAge: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Aadhaar Number</FormLabel>
                  <Input
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>PAN</FormLabel>
                  <Input
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                    placeholder="ABCDE1234F"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Parent / Guardian Name</FormLabel>
                  <Input
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mobile</FormLabel>
                  <Input
                    type="tel"
                    value={formData.buyerMobile}
                    onChange={(e) => setFormData({ ...formData, buyerMobile: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.buyerEmail}
                    onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Payment Mode</FormLabel>
                  <Select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  >
                    <option value="Own Funds">Own Funds</option>
                    <option value="Loan">Loan</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel>Address</FormLabel>
                <Textarea
                  value={formData.buyerAddress}
                  onChange={(e) => setFormData({ ...formData, buyerAddress: e.target.value })}
                />
              </FormControl>

              {formData.paymentMode === 'Loan' && (
                <>
                  <Heading size="sm" mt={4}>Loan Details</Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Bank Name</FormLabel>
                      <Input
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Branch</FormLabel>
                      <Input
                        value={formData.bankBranch}
                        onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Loan Amount</FormLabel>
                      <Input
                        type="number"
                        value={formData.loanAmount}
                        onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                      />
                    </FormControl>
                  </SimpleGrid>
                </>
              )}

              <HStack justify="flex-end" mt={6}>
                <Button variant="outline" onClick={() => navigate('/registrations')}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="blue">
                  Submit Request
                </Button>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
}
