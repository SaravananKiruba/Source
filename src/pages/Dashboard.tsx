import { SimpleGrid, Box, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody, Heading, VStack, Text, Badge } from '@chakra-ui/react';
import { format } from 'date-fns';

export default function Dashboard() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const plots = JSON.parse(localStorage.getItem('plots') || '[]');

  const totalOrders = orders.length;
  const pendingPaymentOrders = orders.filter((o: any) => o.status === 'Order - Pending Payment').length;
  const totalRevenue = payments
    .filter((p: any) => p.status === 'Success')
    .reduce((sum: number, p: any) => sum + p.amount, 0);
  const availablePlots = plots.filter((p: any) => p.isAvailable).length;
  
  // Calculate in-progress orders with pending payments
  const inProgressOrders = orders.filter((order: any) => {
    const orderPayments = payments.filter((p: any) => p.orderId === order.id && p.status === 'Success');
    const totalPaid = orderPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
    return (order.totalCost - totalPaid) > 0;
  }).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{totalOrders}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Payments</StatLabel>
              <StatNumber color="orange.500">{pendingPaymentOrders}</StatNumber>
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
              <StatLabel>In-Progress Orders</StatLabel>
              <StatNumber color="yellow.500">{inProgressOrders}</StatNumber>
              <StatHelpText>With pending amount</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Available Plots</StatLabel>
              <StatNumber color="blue.500">{availablePlots}</StatNumber>
              <StatHelpText>Ready to book</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Recent Orders</Heading>
          <VStack align="stretch" spacing={3}>
            {recentOrders.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>No orders yet</Text>
            ) : (
              recentOrders.map((order: any) => {
                const primaryBuyer = order.buyers?.[0];
                return (
                  <Box key={order.id} p={3} bg="gray.50" borderRadius="md">
                    <Box fontWeight="bold">{primaryBuyer?.buyerName || 'N/A'}</Box>
                    <Box fontSize="sm" color="gray.600">
                      {order.project} - {order.plotNumber} | {format(new Date(order.orderDate), 'dd MMM yyyy')}
                    </Box>
                    <Box fontSize="xs" color="gray.500">
                      Order ID: {order.id} | Customer ID: {order.customerId}
                    </Box>
                    <Badge
                      mt={1}
                      colorScheme={
                        order.status === 'Order - Completed' ? 'green' :
                        order.status === 'Order - Payment Confirmed' ? 'blue' :
                        order.status === 'Order - In Progress' ? 'yellow' : 'orange'
                      }
                    >
                      {order.status?.replace('Order - ', '')}
                    </Badge>
                  </Box>
                );
              })
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
