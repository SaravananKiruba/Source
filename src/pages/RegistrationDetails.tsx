import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  Text,
  Grid,
  GridItem,
  Badge,
  Divider,
  useToast,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { mockRegistrations, mockBookings, mockSlots } from '../data/mockData';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function RegistrationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const toast = useToast();
  const { isOpen: isFeeModalOpen, onOpen: onFeeModalOpen, onClose: onFeeModalClose } = useDisclosure();
  const { isOpen: isTokenModalOpen, onOpen: onTokenModalOpen, onClose: onTokenModalClose } = useDisclosure();
  
  const registration = mockRegistrations.find(r => r.id === id);
  const booking = registration ? mockBookings.find(b => b.id === registration.bookingId) : null;
  const availableSlots = mockSlots.filter(s => s.status === 'Available');
  
  const [regFee, setRegFee] = useState('50000');
  const [selectedSlot, setSelectedSlot] = useState('');

  if (!registration || !booking) {
    return <Box>Registration not found</Box>;
  }

  const handleApprove = () => {
    toast({
      title: 'Registration approved',
      status: 'success',
      duration: 2000,
    });
  };

  const handleReject = () => {
    toast({
      title: 'Registration rejected',
      status: 'error',
      duration: 2000,
    });
  };

  const handleFeeConfirm = () => {
    toast({
      title: 'Registration fee confirmed',
      description: `Amount: ₹${regFee}`,
      status: 'success',
      duration: 2000,
    });
    onFeeModalClose();
  };

  const handleTokenAssign = () => {
    const slot = mockSlots.find(s => s.id === selectedSlot);
    if (slot) {
      toast({
        title: 'Token assigned',
        description: `Token ${slot.tokenNumber} on ${format(new Date(slot.date), 'dd MMM yyyy')}`,
        status: 'success',
        duration: 3000,
      });
      onTokenModalClose();
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Registration Details - {registration.id}</Heading>
        <HStack>
          {registration.status === 'Submitted' && hasPermission('approve-registration') && (
            <>
              <Button colorScheme="green" onClick={handleApprove}>
                Approve
              </Button>
              <Button colorScheme="red" onClick={handleReject}>
                Reject
              </Button>
            </>
          )}
          {registration.status === 'Approved' && !registration.registrationFeePaid && hasPermission('confirm-payment') && (
            <Button colorScheme="blue" onClick={onFeeModalOpen}>
              Confirm Fee Payment
            </Button>
          )}
          {registration.status === 'Approved' && registration.financiallyCleared && !registration.tokenAssigned && hasPermission('assign-token') && (
            <Button colorScheme="purple" onClick={onTokenModalOpen}>
              Assign Token
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/registrations')}>
            Back
          </Button>
        </HStack>
      </HStack>

      <Card>
        <CardBody>
          <HStack mb={4} spacing={4}>
            <Badge
              colorScheme={
                registration.status === 'Approved' ? 'green' :
                registration.status === 'Submitted' ? 'blue' :
                registration.status === 'Rejected' ? 'red' :
                'gray'
              }
            >
              {registration.status}
            </Badge>
            {registration.financiallyCleared && (
              <Badge colorScheme="green">Financially Cleared</Badge>
            )}
            {registration.tokenAssigned && (
              <Badge colorScheme="purple">Token Assigned</Badge>
            )}
          </HStack>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Heading size="sm" mb={3}>Request Information</Heading>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Booking ID:</Text>
                  <Text>{registration.bookingId}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Plot Number:</Text>
                  <Text>{booking?.plotNumber}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Preferred Date:</Text>
                  <Text>{format(new Date(registration.preferredRegDate), 'dd MMM yyyy')}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Documents:</Text>
                  <Text>{registration.documentCount}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Language:</Text>
                  <Badge>{registration.language}</Badge>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem>
              <Heading size="sm" mb={3}>Buyer Information</Heading>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{registration.buyerName}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Age:</Text>
                  <Text>{registration.buyerAge}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Mobile:</Text>
                  <Text>{registration.buyerMobile}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{registration.buyerEmail}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Parent:</Text>
                  <Text>{registration.parentName}</Text>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>

          <Divider my={6} />

          <Heading size="sm" mb={3}>Sensitive Information (Encrypted)</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <HStack justify="space-between">
              <Text fontWeight="bold">Aadhaar:</Text>
              <Text>{registration.aadhaar}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="bold">PAN:</Text>
              <Text>{registration.pan}</Text>
            </HStack>
          </SimpleGrid>

          {registration.paymentMode === 'Loan' && (
            <>
              <Divider my={6} />
              <Heading size="sm" mb={3}>Loan Details</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Bank:</Text>
                  <Text>{registration.bankName}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Branch:</Text>
                  <Text>{registration.bankBranch}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Loan Amount:</Text>
                  <Text>₹{registration.loanAmount ? (Number(registration.loanAmount) / 100000).toFixed(2) : 0}L</Text>
                </HStack>
              </SimpleGrid>
            </>
          )}

          {registration.tokenAssigned && (
            <>
              <Divider my={6} />
              <Heading size="sm" mb={3}>Token Details</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Token Number:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">{registration.tokenNumber}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Office:</Text>
                  <Text>{registration.registrarOffice}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{registration.tokenDate ? format(new Date(registration.tokenDate), 'dd MMM yyyy') : '-'}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Time:</Text>
                  <Text>{registration.tokenTime}</Text>
                </HStack>
              </SimpleGrid>
            </>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isFeeModalOpen} onClose={onFeeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Registration Fee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Registration Fee Amount (₹)</FormLabel>
              <Input
                type="number"
                value={regFee}
                onChange={(e) => setRegFee(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFeeModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleFeeConfirm}>
              Confirm Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isTokenModalOpen} onClose={onTokenModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Select Available Slot</FormLabel>
              <Select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select a slot</option>
                {availableSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.tokenNumber} - {format(new Date(slot.date), 'dd MMM yyyy')} at {slot.time} ({slot.office})
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onTokenModalClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={handleTokenAssign} isDisabled={!selectedSlot}>
              Assign Token
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
