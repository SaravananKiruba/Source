import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  HStack,
  SimpleGrid,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function PlotManagement() {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPlot, setEditingPlot] = useState<any>(null);

  const [formData, setFormData] = useState({
    projectName: '',
    phaseName: '',
    plotNumber: '',
    plotSizeInSqft: '',
    guidelineValuePerSqft: '',
    crmName: '',
    crmPhone: '',
    pdGoogleDriveLocation: '',
    saGoogleDriveLocation: '',
    sdGoogleDriveLocation: '',
    bankAccountNumber: '',
    bankBranch: '',
    bankIFSC: '',
  });

  const plots = JSON.parse(localStorage.getItem('plots') || '[]');

  const crmUsers = [
    { name: 'CRM Executive', phone: '+91 9876543210' },
    { name: 'Rajesh Kumar', phone: '+91 9876543211' },
    { name: 'Priya Sharma', phone: '+91 9876543212' },
    { name: 'Amit Patel', phone: '+91 9876543213' },
    { name: 'Sneha Reddy', phone: '+91 9876543214' },
  ];

  const canManage = user?.role === 'Admin' || user?.role === 'CRM';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const plotData = {
      id: editingPlot?.id || `PLT${Date.now().toString().slice(-6)}`,
      ...formData,
      isAvailable: true,
      createdAt: editingPlot?.createdAt || new Date().toISOString(),
      createdBy: editingPlot?.createdBy || user?.name || 'Unknown',
    };

    const existingPlots = JSON.parse(localStorage.getItem('plots') || '[]');
    
    if (editingPlot) {
      const updatedPlots = existingPlots.map((p: any) => 
        p.id === editingPlot.id ? plotData : p
      );
      localStorage.setItem('plots', JSON.stringify(updatedPlots));
      toast({
        title: 'Plot updated successfully',
        status: 'success',
        duration: 2000,
      });
    } else {
      existingPlots.push(plotData);
      localStorage.setItem('plots', JSON.stringify(existingPlots));
      toast({
        title: 'Plot created successfully',
        description: `Plot ID: ${plotData.id}`,
        status: 'success',
        duration: 3000,
      });
    }

    resetForm();
    onClose();
    window.location.reload();
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      phaseName: '',
      plotNumber: '',
      plotSizeInSqft: '',
      guidelineValuePerSqft: '',
      crmName: '',
      crmPhone: '',
      pdGoogleDriveLocation: '',
      saGoogleDriveLocation: '',
      sdGoogleDriveLocation: '',
      bankAccountNumber: '',
      bankBranch: '',
      bankIFSC: '',
    });
    setEditingPlot(null);
  };

  const handleEdit = (plot: any) => {
    setEditingPlot(plot);
    setFormData({
      projectName: plot.projectName,
      phaseName: plot.phaseName,
      plotNumber: plot.plotNumber,
      plotSizeInSqft: plot.plotSizeInSqft,
      guidelineValuePerSqft: plot.guidelineValuePerSqft,
      crmName: plot.crmName,
      crmPhone: plot.crmPhone,
      pdGoogleDriveLocation: plot.pdGoogleDriveLocation,
      saGoogleDriveLocation: plot.saGoogleDriveLocation,
      sdGoogleDriveLocation: plot.sdGoogleDriveLocation,
      bankAccountNumber: plot.bankAccountNumber,
      bankBranch: plot.bankBranch,
      bankIFSC: plot.bankIFSC,
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plot record?')) {
      const existingPlots = JSON.parse(localStorage.getItem('plots') || '[]');
      const updatedPlots = existingPlots.filter((p: any) => p.id !== id);
      localStorage.setItem('plots', JSON.stringify(updatedPlots));
      toast({
        title: 'Plot deleted successfully',
        status: 'success',
        duration: 2000,
      });
      window.location.reload();
    }
  };

  const openNew = () => {
    resetForm();
    onOpen();
  };

  if (!canManage) {
    return (
      <Box>
        <Heading size="lg" mb={4}>Plot Management</Heading>
        <Card>
          <CardBody>
            <Box textAlign="center" py={10} color="gray.500">
              You don't have permission to manage plots.
            </Box>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Plot Management</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={openNew}>
          Add New Plot
        </Button>
      </HStack>

      <Card>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Plot ID</Th>
                  <Th>Project</Th>
                  <Th>Phase</Th>
                  <Th>Plot Number</Th>
                  <Th>Size (sqft)</Th>
                  <Th>Guideline Value</Th>
                  <Th>CRM</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {plots.map((plot: any) => (
                  <Tr key={plot.id}>
                    <Td fontWeight="bold">{plot.id}</Td>
                    <Td>{plot.projectName}</Td>
                    <Td>{plot.phaseName}</Td>
                    <Td fontWeight="bold">{plot.plotNumber}</Td>
                    <Td>{plot.plotSizeInSqft}</Td>
                    <Td>₹{plot.guidelineValuePerSqft}/sqft</Td>
                    <Td>
                      <Box>{plot.crmName}</Box>
                      <Box fontSize="xs" color="gray.600">{plot.crmPhone}</Box>
                    </Td>
                    <Td>
                      <Badge colorScheme={plot.isAvailable ? 'green' : 'red'}>
                        {plot.isAvailable ? 'Available' : 'Booked'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack>
                        <IconButton
                          icon={<FiEdit />}
                          aria-label="Edit"
                          size="sm"
                          onClick={() => handleEdit(plot)}
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Delete"
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(plot.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {plots.length === 0 && (
            <Box textAlign="center" py={10} color="gray.500">
              No plots found. Click "Add New Plot" to create one.
            </Box>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingPlot ? 'Edit Plot' : 'Add New Plot'}</ModalHeader>
          <ModalBody>
            <Box as="form" id="plot-form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <SimpleGrid columns={2} spacing={4} width="100%">
                  <FormControl isRequired>
                    <FormLabel>Project Name</FormLabel>
                    <Input
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Phase Name</FormLabel>
                    <Input
                      value={formData.phaseName}
                      onChange={(e) => setFormData({ ...formData, phaseName: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Plot Number</FormLabel>
                    <Input
                      value={formData.plotNumber}
                      onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Plot Size (sqft)</FormLabel>
                    <Input
                      type="number"
                      value={formData.plotSizeInSqft}
                      onChange={(e) => setFormData({ ...formData, plotSizeInSqft: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Guideline Value per Sqft (₹)</FormLabel>
                    <Input
                      type="number"
                      value={formData.guidelineValuePerSqft}
                      onChange={(e) => setFormData({ ...formData, guidelineValuePerSqft: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>CRM Name</FormLabel>
                    <Select
                      value={formData.crmName}
                      onChange={(e) => {
                        const selectedCRM = crmUsers.find(c => c.name === e.target.value);
                        setFormData({ 
                          ...formData, 
                          crmName: e.target.value,
                          crmPhone: selectedCRM?.phone || formData.crmPhone
                        });
                      }}
                      placeholder="Select CRM"
                    >
                      {crmUsers.map((crm) => (
                        <option key={crm.name} value={crm.name}>{crm.name}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>CRM Phone</FormLabel>
                    <Input
                      type="tel"
                      value={formData.crmPhone}
                      onChange={(e) => setFormData({ ...formData, crmPhone: e.target.value })}
                      isReadOnly
                      bg="gray.50"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>PD Google Drive Location</FormLabel>
                    <Input
                      value={formData.pdGoogleDriveLocation}
                      onChange={(e) => setFormData({ ...formData, pdGoogleDriveLocation: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>SA Google Drive Location</FormLabel>
                    <Input
                      value={formData.saGoogleDriveLocation}
                      onChange={(e) => setFormData({ ...formData, saGoogleDriveLocation: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>SD Google Drive Location</FormLabel>
                    <Input
                      value={formData.sdGoogleDriveLocation}
                      onChange={(e) => setFormData({ ...formData, sdGoogleDriveLocation: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bank Account Number</FormLabel>
                    <Input
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bank Branch</FormLabel>
                    <Input
                      value={formData.bankBranch}
                      onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bank IFSC Code</FormLabel>
                    <Input
                      value={formData.bankIFSC}
                      onChange={(e) => setFormData({ ...formData, bankIFSC: e.target.value.toUpperCase() })}
                      maxLength={11}
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="plot-form" colorScheme="blue">
              {editingPlot ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
