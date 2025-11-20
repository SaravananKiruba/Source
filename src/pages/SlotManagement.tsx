import { useState, useMemo } from 'react';
import {
  Box,
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
} from '@chakra-ui/react';
import { mockSlots, mockRegistrations } from '../data/mockData';
import { format } from 'date-fns';

export default function SlotManagement() {
  const [dateFilter, setDateFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredSlots = useMemo(() => {
    return mockSlots.filter(slot => {
      const matchesDate = !dateFilter || slot.date === dateFilter;
      const matchesOffice = !officeFilter || slot.office === officeFilter;
      const matchesStatus = !statusFilter || slot.status === statusFilter;
      
      return matchesDate && matchesOffice && matchesStatus;
    }).sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
  }, [dateFilter, officeFilter, statusFilter]);

  const offices = Array.from(new Set(mockSlots.map(s => s.office)));

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Slot & Token Management</Heading>

      <Card>
        <CardBody>
          <HStack mb={4} spacing={4}>
            <Input
              type="date"
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Select
              placeholder="All Offices"
              value={officeFilter}
              onChange={(e) => setOfficeFilter(e.target.value)}
              maxW="300px"
            >
              {offices.map(office => (
                <option key={office} value={office}>{office}</option>
              ))}
            </Select>
            <Select
              placeholder="All Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="200px"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
            </Select>
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Token Number</Th>
                  <Th>Office</Th>
                  <Th>Status</Th>
                  <Th>Registration ID</Th>
                  <Th>Customer</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSlots.map(slot => {
                  const registration = slot.registrationId 
                    ? mockRegistrations.find(r => r.id === slot.registrationId)
                    : null;
                  
                  return (
                    <Tr key={slot.id}>
                      <Td>{format(new Date(slot.date), 'dd MMM yyyy')}</Td>
                      <Td>{slot.time}</Td>
                      <Td fontWeight="bold">{slot.tokenNumber}</Td>
                      <Td fontSize="sm">{slot.office}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            slot.status === 'Available' ? 'green' :
                            slot.status === 'Reserved' ? 'yellow' :
                            slot.status === 'Confirmed' ? 'blue' :
                            'purple'
                          }
                        >
                          {slot.status}
                        </Badge>
                      </Td>
                      <Td>{slot.registrationId || '-'}</Td>
                      <Td>{registration?.buyerName || '-'}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>

          {filteredSlots.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No slots found
            </Box>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
