import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
} from '@chakra-ui/react';
import { mockBookings, mockPayments, mockMilestones } from '../data/mockData';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  const booking = mockBookings.find(b => b.id === id);
  const payment = mockPayments.find(p => p.bookingId === id);
  const milestones = mockMilestones.filter(m => m.bookingId === id);

  if (!booking) {
    return (
      <Box>
        <Text>Booking not found</Text>
        <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
      </Box>
    );
  }

  const overdueMilestones = milestones.filter(m => 
    m.status === 'Pending' && new Date(m.dueDate) < new Date()
  );

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Booking Details - {booking.id}</Heading>
        <HStack>
          {booking.status === 'Booked - Pending Payment' && hasPermission('confirm-payment') && (
            <Button
              as={Link}
              to={`/bookings/${id}/payment`}
              colorScheme="green"
            >
              Record Payment
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/bookings')}>
            Back
          </Button>
        </HStack>
      </HStack>

      <Card>
        <CardBody>
          <Badge colorScheme={booking.status === 'Booked - Payment Confirmed' ? 'green' : 'orange'} mb={4}>
            {booking.status}
          </Badge>

          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Heading size="sm" mb={3}>Customer Information</Heading>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{booking.customerName}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Mobile:</Text>
                  <Text>{booking.mobile}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{booking.email}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Address:</Text>
                  <Text textAlign="right">{booking.address}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Mode of Purchase:</Text>
                  <Badge>{booking.modeOfPurchase}</Badge>
                </HStack>
              </VStack>
            </GridItem>

            <GridItem>
              <Heading size="sm" mb={3}>Property Details</Heading>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Project:</Text>
                  <Text>{booking.project}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Layout:</Text>
                  <Text>{booking.layout}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Plot Number:</Text>
                  <Text>{booking.plotNumber}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Area:</Text>
                  <Text>{booking.area} sq ft</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total Cost:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    ₹{(booking.totalCost / 100000).toFixed(2)}L
                  </Text>
                </HStack>
              </VStack>
            </GridItem>
          </Grid>

          <Divider my={6} />

          <Heading size="sm" mb={3}>Booking Information</Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <HStack justify="space-between">
              <Text fontWeight="bold">Booking Date:</Text>
              <Text>{format(new Date(booking.bookingDate), 'dd MMM yyyy')}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="bold">Created By:</Text>
              <Text>{booking.createdBy}</Text>
            </HStack>
          </Grid>
        </CardBody>
      </Card>

      {payment && (
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Payment Details</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold">Receipt Number:</Text>
                <Text>{payment.receiptNumber}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Amount:</Text>
                <Text fontWeight="bold" color="green.600">₹{(payment.amount / 100000).toFixed(2)}L</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Payment Mode:</Text>
                <Badge>{payment.paymentMode}</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Payment Date:</Text>
                <Text>{format(new Date(payment.paymentDate), 'dd MMM yyyy')}</Text>
              </HStack>
              {payment.razorpayPaymentId && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">Razorpay Payment ID:</Text>
                  <Text fontSize="sm">{payment.razorpayPaymentId}</Text>
                </HStack>
              )}
              {payment.chequeNumber && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">Cheque Number:</Text>
                  <Text>{payment.chequeNumber}</Text>
                </HStack>
              )}
              {payment.utrNumber && (
                <HStack justify="space-between">
                  <Text fontWeight="bold">UTR Number:</Text>
                  <Text>{payment.utrNumber}</Text>
                </HStack>
              )}
            </Grid>
          </CardBody>
        </Card>
      )}

      {milestones.length > 0 && (
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Payment Milestones
              {overdueMilestones.length > 0 && (
                <Badge colorScheme="red" ml={2}>
                  {overdueMilestones.length} Overdue
                </Badge>
              )}
            </Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Due Date</Th>
                  <Th>Status</Th>
                  <Th>Paid Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {milestones.map(milestone => {
                  const isOverdue = milestone.status === 'Pending' && new Date(milestone.dueDate) < new Date();
                  return (
                    <Tr key={milestone.id} bg={isOverdue ? 'red.50' : 'transparent'}>
                      <Td>{milestone.description}</Td>
                      <Td>₹{(milestone.amount / 100000).toFixed(2)}L</Td>
                      <Td>
                        {format(new Date(milestone.dueDate), 'dd MMM yyyy')}
                        {isOverdue && <Badge colorScheme="red" ml={2}>Overdue</Badge>}
                      </Td>
                      <Td>
                        <Badge colorScheme={milestone.status === 'Paid' ? 'green' : 'orange'}>
                          {milestone.status}
                        </Badge>
                      </Td>
                      <Td>
                        {milestone.paidDate ? format(new Date(milestone.paidDate), 'dd MMM yyyy') : '-'}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}
