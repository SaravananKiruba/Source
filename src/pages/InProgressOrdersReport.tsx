import {
  Box,
  Card,
  CardBody,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  HStack,
  Select,
  Input,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function InProgressOrdersReport() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');

  const inProgressOrders = useMemo(() => {
    return orders
      .filter((order: any) => {
        // Only show orders with pending payments
        const orderPayments = payments.filter((p: any) => 
          p.orderId === order.id && p.status === 'Success'
        );
        const totalPaid = orderPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        const totalCost = order.totalCost || 0;
        const pending = totalCost - totalPaid;

        return pending > 0;
      })
      .map((order: any) => {
        const orderPayments = payments.filter((p: any) => 
          p.orderId === order.id && p.status === 'Success'
        );
        const totalPaid = orderPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
        const totalCost = order.totalCost || 0;
        const pending = totalCost - totalPaid;
        
        const lastPayment = orderPayments.sort((a: any, b: any) => 
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        )[0];

        const orderDate = new Date(order.orderDate);
        const today = new Date();
        const daysOverdue = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

        const primaryBuyer = order.buyers?.[0];

        return {
          orderId: order.id,
          customerId: order.customerId,
          customerName: primaryBuyer?.buyerName || 'N/A',
          project: order.project,
          plotNumber: order.plotNumber,
          totalCost: totalCost,
          amountPaid: totalPaid,
          amountPending: pending,
          status: order.status,
          orderDate: order.orderDate,
          lastPaymentDate: lastPayment?.paymentDate,
          daysOverdue: daysOverdue,
        };
      })
      .filter((order: any) => {
        const matchesStatus = !statusFilter || order.status === statusFilter;
        const matchesSearch = 
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.plotNumber.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesSearch;
      })
      .sort((a: any, b: any) => b.amountPending - a.amountPending);
  }, [orders, payments, statusFilter, searchTerm]);

  const totalPendingAmount = inProgressOrders.reduce((sum: number, order: any) => 
    sum + order.amountPending, 0
  );

  if (user?.role !== 'BusinessOwner' && user?.role !== 'Admin') {
    return (
      <Box>
        <Heading size="lg" mb={4}>In-Progress Orders Report</Heading>
        <Card>
          <CardBody>
            <Box textAlign="center" py={10} color="gray.500">
              You don't have permission to view this report.
            </Box>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">In-Progress Orders Report</Heading>

      <Card bg="orange.50">
        <CardBody>
          <HStack justify="space-between">
            <Box>
              <Text fontSize="sm" color="gray.600">Total Orders with Pending Payments</Text>
              <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                {inProgressOrders.length}
              </Text>
            </Box>
            <Box textAlign="right">
              <Text fontSize="sm" color="gray.600">Total Pending Amount</Text>
              <Text fontSize="3xl" fontWeight="bold" color="red.600">
                ₹{(totalPendingAmount / 100000).toFixed(2)}L
              </Text>
            </Box>
          </HStack>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <HStack mb={4} spacing={4}>
            <Input
              placeholder="Search by Order ID, Customer ID, Name, or Plot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="250px"
            >
              <option value="Order - Pending Payment">Pending Payment</option>
              <option value="Order - Payment Confirmed">Payment Confirmed</option>
              <option value="Order - In Progress">In Progress</option>
            </Select>
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Order ID / Customer ID</Th>
                  <Th>Customer Name</Th>
                  <Th>Project</Th>
                  <Th>Plot</Th>
                  <Th>Total Cost</Th>
                  <Th>Amount Paid</Th>
                  <Th>Pending Amount</Th>
                  <Th>Status</Th>
                  <Th>Order Date</Th>
                  <Th>Last Payment</Th>
                  <Th>Days Overdue</Th>
                </Tr>
              </Thead>
              <Tbody>
                {inProgressOrders.map((order: any) => (
                  <Tr key={order.orderId}>
                    <Td>
                      <Box fontWeight="bold">{order.orderId}</Box>
                      <Box fontSize="xs" color="gray.600">{order.customerId}</Box>
                    </Td>
                    <Td>{order.customerName}</Td>
                    <Td>{order.project}</Td>
                    <Td fontWeight="bold">{order.plotNumber}</Td>
                    <Td>₹{(order.totalCost / 100000).toFixed(2)}L</Td>
                    <Td color="green.600">₹{(order.amountPaid / 100000).toFixed(2)}L</Td>
                    <Td fontWeight="bold" color="red.600">
                      ₹{(order.amountPending / 100000).toFixed(2)}L
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          order.status === 'Order - In Progress' ? 'yellow' :
                          order.status === 'Order - Payment Confirmed' ? 'blue' : 'orange'
                        }
                      >
                        {order.status?.replace('Order - ', '')}
                      </Badge>
                    </Td>
                    <Td>{format(new Date(order.orderDate), 'dd MMM yyyy')}</Td>
                    <Td>
                      {order.lastPaymentDate ? 
                        format(new Date(order.lastPaymentDate), 'dd MMM yyyy') : 
                        'No payment'}
                    </Td>
                    <Td>
                      <Badge colorScheme={order.daysOverdue > 30 ? 'red' : order.daysOverdue > 15 ? 'orange' : 'yellow'}>
                        {order.daysOverdue} days
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {inProgressOrders.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No in-progress orders with pending payments found
            </Box>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
