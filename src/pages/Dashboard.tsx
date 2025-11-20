import { SimpleGrid, Box, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Heading, VStack } from '@chakra-ui/react';
import { mockBookings, mockRegistrations, mockPayments, mockMilestones } from '../data/mockData';
import { format } from 'date-fns';

export default function Dashboard() {
  const totalBookings = mockBookings.length;
  const pendingPayments = mockBookings.filter(b => b.status === 'Booked - Pending Payment').length;
  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingRegistrations = mockRegistrations.filter(r => r.status === 'Submitted').length;
  const overdueMilestones = mockMilestones.filter(m => 
    m.status === 'Pending' && new Date(m.dueDate) < new Date()
  ).length;

  const recentBookings = mockBookings.slice(0, 5);

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Bookings</StatLabel>
              <StatNumber>{totalBookings}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Payments</StatLabel>
              <StatNumber color="orange.500">{pendingPayments}</StatNumber>
              <StatHelpText>Awaiting payment</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber color="green.500">₹{(totalRevenue / 100000).toFixed(2)}L</StatNumber>
              <StatHelpText>Collected</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Registrations</StatLabel>
              <StatNumber color="blue.500">{pendingRegistrations}</StatNumber>
              <StatHelpText>Awaiting approval</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Overdue Milestones</StatLabel>
              <StatNumber color="red.500">{overdueMilestones}</StatNumber>
              <StatHelpText>Past due date</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Recent Bookings</Heading>
          <VStack align="stretch" spacing={3}>
            {recentBookings.map(booking => (
              <Box key={booking.id} p={3} bg="gray.50" borderRadius="md">
                <Box fontWeight="bold">{booking.customerName}</Box>
                <Box fontSize="sm" color="gray.600">
                  {booking.project} - {booking.plotNumber} | {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
                </Box>
                <Box fontSize="sm" color={booking.status === 'Booked - Payment Confirmed' ? 'green.600' : 'orange.600'}>
                  {booking.status}
                </Box>
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
