import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function OrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { hasPermission } = useAuth();

  // Get orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order: any) => {
      const primaryBuyer = order.buyers?.[0];
      const customerName = primaryBuyer?.buyerName || 'Unknown';
      const customerMobile = primaryBuyer?.buyerMobile || '';
      
      const matchesSearch = 
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerMobile.includes(searchTerm) ||
        order.plotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a: any, b: any) => {
      let comparison = 0;
      const aBuyer = a.buyers?.[0];
      const bBuyer = b.buyers?.[0];
      
      if (sortBy === 'date') {
        comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      } else if (sortBy === 'name') {
        comparison = (aBuyer?.buyerName || '').localeCompare(bBuyer?.buyerName || '');
      } else if (sortBy === 'cost') {
        comparison = (a.totalCost || 0) - (b.totalCost || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'date' | 'name' | 'cost') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Orders</Heading>
        {hasPermission('create-order') && (
          <Button as={Link} to="/orders/new" leftIcon={<FiPlus />} colorScheme="blue">
            New Order
          </Button>
        )}
      </HStack>

      <Card>
        <CardBody>
          <HStack mb={4} spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch />
              </InputLeftElement>
              <Input
                placeholder="Search by name, mobile, plot, Order ID, or Customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="250px"
            >
              <option value="Order - Pending Payment">Pending Payment</option>
              <option value="Order - Payment Confirmed">Payment Confirmed</option>
              <option value="Order - In Progress">In Progress</option>
              <option value="Order - Completed">Completed</option>
            </Select>
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th cursor="pointer" onClick={() => toggleSort('date')}>
                    Order ID / Customer ID {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Date</Th>
                  <Th cursor="pointer" onClick={() => toggleSort('name')}>
                    Customer Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Mobile</Th>
                  <Th>Project</Th>
                  <Th>Plot</Th>
                  <Th cursor="pointer" onClick={() => toggleSort('cost')}>
                    Total Cost {sortBy === 'cost' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAndSortedOrders.map((order: any) => {
                  const primaryBuyer = order.buyers?.[0];
                  return (
                    <Tr key={order.id}>
                      <Td>
                        <Box fontWeight="bold">{order.id}</Box>
                        <Box fontSize="xs" color="gray.600">{order.customerId}</Box>
                      </Td>
                      <Td>{format(new Date(order.orderDate), 'dd MMM yyyy')}</Td>
                      <Td>{primaryBuyer?.buyerName || 'N/A'}</Td>
                      <Td>{primaryBuyer?.buyerMobile || 'N/A'}</Td>
                      <Td>{order.project}</Td>
                      <Td fontWeight="bold">{order.plotNumber}</Td>
                      <Td>₹{(order.totalCost / 100000).toFixed(2)}L</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            order.status === 'Order - Completed' ? 'green' :
                            order.status === 'Order - Payment Confirmed' ? 'blue' :
                            order.status === 'Order - In Progress' ? 'yellow' : 'orange'
                          }
                        >
                          {order.status?.replace('Order - ', '')}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          as={Link}
                          to={`/orders/${order.id}`}
                          icon={<FiEye />}
                          aria-label="View order"
                          size="sm"
                          variant="ghost"
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>

          {filteredAndSortedOrders.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No orders found
            </Box>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
