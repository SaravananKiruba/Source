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
import { FiPlus, FiEye } from 'react-icons/fi';
import { mockRegistrations, mockBookings } from '../data/mockData';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function RegistrationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { hasPermission } = useAuth();

  const filteredRegistrations = useMemo(() => {
    return mockRegistrations.filter(reg => {
      const booking = mockBookings.find(b => b.id === reg.bookingId);
      const matchesSearch = 
        reg.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking?.plotNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || reg.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Registration Requests</Heading>
        {hasPermission('create-registration') && (
          <Button as={Link} to="/registrations/new" leftIcon={<FiPlus />} colorScheme="blue">
            New Registration Request
          </Button>
        )}
      </HStack>

      <Card>
        <CardBody>
          <HStack mb={4} spacing={4}>
            <Input
              placeholder="Search by name, registration ID, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="300px"
            >
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </Select>
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Registration ID</Th>
                  <Th>Booking ID</Th>
                  <Th>Buyer Name</Th>
                  <Th>Preferred Date</Th>
                  <Th>Language</Th>
                  <Th>Status</Th>
                  <Th>Token</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRegistrations.map(reg => (
                  <Tr key={reg.id}>
                    <Td fontWeight="bold">{reg.id}</Td>
                    <Td>{reg.bookingId}</Td>
                    <Td>{reg.buyerName}</Td>
                    <Td>{format(new Date(reg.preferredRegDate), 'dd MMM yyyy')}</Td>
                    <Td>
                      <Badge>{reg.language}</Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          reg.status === 'Approved' ? 'green' :
                          reg.status === 'Submitted' ? 'blue' :
                          reg.status === 'Rejected' ? 'red' :
                          reg.status === 'Completed' ? 'purple' :
                          'gray'
                        }
                      >
                        {reg.status}
                      </Badge>
                    </Td>
                    <Td>
                      {reg.tokenAssigned ? (
                        <Box fontSize="xs">
                          <Box fontWeight="bold">{reg.tokenNumber}</Box>
                          <Box color="gray.600">{reg.tokenDate}</Box>
                        </Box>
                      ) : (
                        <Badge colorScheme="orange">Not Assigned</Badge>
                      )}
                    </Td>
                    <Td>
                      <IconButton
                        as={Link}
                        to={`/registrations/${reg.id}`}
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

          {filteredRegistrations.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No registration requests found
            </Box>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
