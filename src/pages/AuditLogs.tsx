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
  Button,
} from '@chakra-ui/react';
import { mockAuditLogs } from '../data/mockData';
import { format } from 'date-fns';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter(log => {
      const matchesSearch = 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEntity = !entityFilter || log.entity === entityFilter;
      const matchesAction = !actionFilter || log.action === actionFilter;
      
      return matchesSearch && matchesEntity && matchesAction;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [searchTerm, entityFilter, actionFilter]);

  const entities = Array.from(new Set(mockAuditLogs.map(l => l.entity)));
  const actions = Array.from(new Set(mockAuditLogs.map(l => l.action)));

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity', 'Entity ID', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userName,
        log.action,
        log.entity,
        log.entityId,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Audit Logs</Heading>
        <Button onClick={handleExport} colorScheme="blue" size="sm">
          Export CSV
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <HStack mb={4} spacing={4}>
            <Input
              placeholder="Search by user, entity ID, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="All Entities"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              maxW="200px"
            >
              {entities.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </Select>
            <Select
              placeholder="All Actions"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              maxW="200px"
            >
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </Select>
          </HStack>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Timestamp</Th>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Entity</Th>
                  <Th>Entity ID</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredLogs.map(log => (
                  <Tr key={log.id}>
                    <Td fontSize="xs">
                      {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm:ss')}
                    </Td>
                    <Td>{log.userName}</Td>
                    <Td>
                      <Badge colorScheme="blue">{log.action}</Badge>
                    </Td>
                    <Td>{log.entity}</Td>
                    <Td fontWeight="bold">{log.entityId}</Td>
                    <Td fontSize="sm">{log.details}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredLogs.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No audit logs found
            </Box>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}
