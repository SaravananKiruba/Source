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
import { mockBookings } from '../data/mockData';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function BookingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { hasPermission } = useAuth();

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = mockBookings.filter(booking => {
      const matchesSearch = 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.mobile.includes(searchTerm) ||
        booking.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      } else if (sortBy === 'name') {
        comparison = a.customerName.localeCompare(b.customerName);
      } else if (sortBy === 'cost') {
        comparison = a.totalCost - b.totalCost;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

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
        <Heading size="lg">Bookings</Heading>
        {hasPermission('create-booking') && (
          <Button as={Link} to="/bookings/new" leftIcon={<FiPlus />} colorScheme="blue">
            New Booking
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
                placeholder="Search by name, mobile, plot number, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="300px"
            >
              <option value="Booked - Pending Payment">Pending Payment</option>
              <option value="Booked - Payment Confirmed">Payment Confirmed</option>
            </Select>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'cost')}
              maxW="200px"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="cost">Sort by Cost</option>
            </Select>
            <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} size="sm">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th cursor="pointer" onClick={() => toggleSort('date')}>
                    Booking ID / Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th cursor="pointer" onClick={() => toggleSort('name')}>
                    Customer {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Project / Plot</Th>
                  <Th cursor="pointer" onClick={() => toggleSort('cost')}>
                    Total Cost {sortBy === 'cost' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAndSortedBookings.map(booking => (
                  <Tr key={booking.id}>
                    <Td>
                      <Box fontWeight="bold">{booking.id}</Box>
                      <Box fontSize="xs" color="gray.600">
                        {format(new Date(booking.bookingDate), 'dd MMM yyyy')}
                      </Box>
                    </Td>
                    <Td>
                      <Box>{booking.customerName}</Box>
                      <Box fontSize="xs" color="gray.600">{booking.mobile}</Box>
                    </Td>
                    <Td>
                      <Box>{booking.project}</Box>
                      <Box fontSize="xs" color="gray.600">{booking.plotNumber}</Box>
                    </Td>
                    <Td>₹{(booking.totalCost / 100000).toFixed(2)}L</Td>
                    <Td>
                      <Badge colorScheme={booking.status === 'Booked - Payment Confirmed' ? 'green' : 'orange'}>
                        {booking.status}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton
                        as={Link}
                        to={`/bookings/${booking.id}`}
                        aria-label="View"
                        icon={<FiEye />}
                        size="sm"
                        variant="ghost"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredAndSortedBookings.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No bookings found
            </Box>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
