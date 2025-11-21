import { useState, useRef, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Heading,
  SimpleGrid,
  useToast,
  HStack,
  Progress,
  Text,
  IconButton,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiCamera, FiUpload, FiLock, FiUnlock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { BuyerDetail } from '../types';

export default function OrderForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const { isOpen: isOtpOpen, onOpen: onOtpOpen, onClose: onOtpClose } = useDisclosure();
  
  const [formData, setFormData] = useState({
    modeOfPurchase: 'Own Funds' as 'Own Funds' | 'Loan',
    project: '',
    layout: '',
    plotNumber: '',
    area: '',
    totalCost: '',
    guidelineValue: '',
    languageForSaleDeed: 'English' as 'Tamil' | 'English',
    bankName: '',
    bankBranch: '',
    loanAmount: '',
  });

  const [buyers, setBuyers] = useState<BuyerDetail[]>([
    {
      id: '1',
      buyerType: 'Indian',
      buyerName: '',
      buyerNameTamil: '',
      buyerAge: 0,
      aadhaar: '',
      pan: '',
      passport: '',
      parentName: '',
      parentNameTamil: '',
      buyerAddress: '',
      buyerMobile: '',
      buyerEmail: '',
      aadhaarFile: null,
      panFile: null,
      passportFile: null,
    }
  ]);

  const aadhaarInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const panInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const passportInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const cameraInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Load plots from localStorage
  const plots = JSON.parse(localStorage.getItem('plots') || '[]');
  const availablePlots = plots.filter((p: any) => p.isAvailable);
  
  // Get unique projects
  const projects: string[] = Array.from(new Set(availablePlots.map((p: any) => p.projectName as string)));
  
  // Filter phases based on selected project
  const filteredPhases: string[] = Array.from(new Set(
    availablePlots
      .filter((p: any) => p.projectName === formData.project)
      .map((p: any) => p.phaseName as string)
  ));
  
  // Filter plot numbers based on selected project and phase
  const filteredPlotRecords = availablePlots
    .filter((p: any) => 
      p.projectName === formData.project && 
      p.phaseName === formData.layout
    );

  // Handle plot selection to auto-populate fields
  const handlePlotSelect = (plotNumber: string) => {
    const selectedPlot = filteredPlotRecords.find((p: any) => p.plotNumber === plotNumber);
    if (selectedPlot) {
      const totalCost = parseFloat(selectedPlot.plotSizeInSqft) * parseFloat(selectedPlot.guidelineValuePerSqft);
      setFormData({
        ...formData,
        plotNumber: plotNumber,
        area: selectedPlot.plotSizeInSqft,
        guidelineValue: selectedPlot.guidelineValuePerSqft,
        totalCost: totalCost.toString(),
      });
    }
  };

  const addBuyer = () => {
    const newBuyer: BuyerDetail = {
      id: Date.now().toString(),
      buyerType: 'Indian',
      buyerName: '',
      buyerNameTamil: '',
      buyerAge: 0,
      aadhaar: '',
      pan: '',
      passport: '',
      parentName: '',
      parentNameTamil: '',
      buyerAddress: '',
      buyerMobile: '',
      buyerEmail: '',
      aadhaarFile: null,
      panFile: null,
      passportFile: null,
    };
    setBuyers([...buyers, newBuyer]);
    toast({
      title: 'Buyer added',
      description: 'New buyer details section added',
      status: 'info',
      duration: 2000,
    });
  };

  const removeBuyer = (id: string) => {
    if (buyers.length === 1) {
      toast({
        title: 'Cannot remove',
        description: 'At least one buyer is required',
        status: 'warning',
        duration: 2000,
      });
      return;
    }
    setBuyers(buyers.filter(b => b.id !== id));
    toast({
      title: 'Buyer removed',
      status: 'info',
      duration: 2000,
    });
  };

  const updateBuyer = (id: string, field: keyof BuyerDetail, value: any) => {
    setBuyers(buyers.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const validateFileSize = (file: File): boolean => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    return file.size <= maxSize;
  };

  const validateFileType = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    return validTypes.includes(file.type);
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Reduce resolution by 50%
          canvas.width = img.width * 0.5;
          canvas.height = img.height * 0.5;
          
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.7);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (buyerId: string, fileType: 'aadhaar' | 'pan' | 'passport', file: File) => {
    if (!validateFileType(file)) {
      toast({
        title: 'Invalid file format',
        description: 'Please upload PDF, JPEG, or PNG files only',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    if (!validateFileSize(file)) {
      const compress = window.confirm(
        `File size is ${(file.size / (1024 * 1024)).toFixed(2)}MB which exceeds 20MB limit. Do you want to reduce the resolution automatically?`
      );
      
      if (compress) {
        if (file.type.startsWith('image/')) {
          toast({
            title: 'Compressing image...',
            status: 'info',
            duration: 2000,
          });
          file = await compressImage(file);
          toast({
            title: 'Image compressed',
            description: `New size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            status: 'success',
            duration: 2000,
          });
        } else {
          toast({
            title: 'Cannot compress PDF',
            description: 'Please upload a smaller PDF file',
            status: 'error',
            duration: 3000,
          });
          return;
        }
      } else {
        return;
      }
    }

    // Simulate image quality check
    const quality = Math.random();
    if (quality < 0.3) {
      toast({
        title: 'Poor image quality',
        description: 'The uploaded document is not clear. Please upload a better quality image.',
        status: 'error',
        duration: 4000,
      });
      return;
    }

    const fieldName = fileType === 'aadhaar' ? 'aadhaarFile' : fileType === 'pan' ? 'panFile' : 'passportFile';
    updateBuyer(buyerId, fieldName, file);
    
    toast({
      title: 'File uploaded successfully',
      description: `${fileType.toUpperCase()} document uploaded`,
      status: 'success',
      duration: 2000,
    });
  };

  const handleCameraCapture = (buyerId: string, fileType: 'aadhaar' | 'pan' | 'passport', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(buyerId, fileType, file);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const requestOTP = () => {
    onOtpOpen();
    toast({
      title: 'OTP Sent',
      description: 'OTP has been sent to your registered email',
      status: 'info',
      duration: 3000,
    });
  };

  const verifyOTP = () => {
    if (otpValue === '123456') {
      setOtpVerified(true);
      onOtpClose();
      toast({
        title: 'OTP Verified',
        description: 'You can now submit the order form',
        status: 'success',
        duration: 2000,
      });
    } else {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const notifyCRM = () => {
    // Simulate CRM notification for loan option
    toast({
      title: 'CRM Notified',
      description: 'CRM has been notified with client and booking details',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast({
        title: 'Form is locked',
        description: 'This form has been locked by CRM',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // If CRM is filling on behalf of customer, require OTP
    if (user?.role === 'CRM' && !otpVerified) {
      toast({
        title: 'OTP verification required',
        description: 'Please verify customer email OTP before submitting',
        status: 'warning',
        duration: 3000,
      });
      requestOTP();
      return;
    }

    // Validate buyer documents
    for (const buyer of buyers) {
      if (buyer.buyerType === 'Indian') {
        if (!buyer.aadhaarFile) {
          toast({
            title: 'Missing Aadhaar',
            description: `Please upload Aadhaar card for ${buyer.buyerName || 'buyer'}`,
            status: 'error',
            duration: 3000,
          });
          return;
        }
        if (!buyer.panFile) {
          toast({
            title: 'Missing PAN',
            description: `Please upload PAN card for ${buyer.buyerName || 'buyer'}`,
            status: 'error',
            duration: 3000,
          });
          return;
        }
      } else if (buyer.buyerType === 'NRI') {
        if (!buyer.passportFile) {
          toast({
            title: 'Missing Passport',
            description: `Please upload Passport for ${buyer.buyerName || 'buyer'}`,
            status: 'error',
            duration: 3000,
          });
          return;
        }
      }
    }

    const orderId = `ORD${Date.now().toString().slice(-6)}`;
    const customerId = `CUST${Date.now().toString().slice(-6)}`;

    // If loan option selected, notify CRM
    if (formData.modeOfPurchase === 'Loan') {
      notifyCRM();
    }

    const orderData = {
      id: orderId,
      customerId: customerId,
      orderDate: new Date().toISOString(),
      ...formData,
      buyers: buyers,
      status: 'Order - Pending Payment',
      createdBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    toast({
      title: 'Order created successfully',
      description: `Order ID: ${orderId} | Customer ID: ${customerId}`,
      status: 'success',
      duration: 5000,
    });
    navigate('/orders');
  };

  const toggleLock = () => {
    if (user?.role === 'CRM' || user?.role === 'Admin') {
      setIsLocked(!isLocked);
      toast({
        title: isLocked ? 'Form Unlocked' : 'Form Locked',
        description: isLocked ? 'Customers can now edit this form' : 'Form is now locked for editing',
        status: 'info',
        duration: 2000,
      });
    }
  };

  const canLockForm = user?.role === 'CRM' || user?.role === 'Admin';

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">New Order Form</Heading>
        <HStack>
          {canLockForm && (
            <Button
              leftIcon={isLocked ? <FiLock /> : <FiUnlock />}
              onClick={toggleLock}
              colorScheme={isLocked ? 'red' : 'green'}
              size="sm"
            >
              {isLocked ? 'Locked' : 'Unlocked'}
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/orders')}>
            Cancel
          </Button>
        </HStack>
      </HStack>

      {isLocked && (
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Form Locked!</AlertTitle>
          <AlertDescription>This order form has been locked by CRM and cannot be edited.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch" mb={6}>
            <Progress value={(currentStep / 3) * 100} colorScheme="blue" />
            <Text fontSize="sm" color="gray.600">
              Step {currentStep} of 3
            </Text>
          </VStack>

          <Box as="form" onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              
              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <>
                  <Heading size="md">Property Details</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired isDisabled={isLocked}>
                      <FormLabel>Project</FormLabel>
                      <Select
                        value={formData.project}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value, layout: '', plotNumber: '', area: '', guidelineValue: '', totalCost: '' })}
                        placeholder="Select Project"
                      >
                        {projects.map((proj: string) => (
                          <option key={proj} value={proj}>{proj}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired isDisabled={isLocked}>
                      <FormLabel>Phase/Layout</FormLabel>
                      <Select
                        value={formData.layout}
                        onChange={(e) => setFormData({ ...formData, layout: e.target.value, plotNumber: '', area: '', guidelineValue: '', totalCost: '' })}
                        placeholder="Select Phase/Layout"
                        isDisabled={!formData.project}
                      >
                        {filteredPhases.map((phase: string) => (
                          <option key={phase} value={phase}>{phase}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired isDisabled={isLocked}>
                      <FormLabel>Plot Number</FormLabel>
                      <Select
                        value={formData.plotNumber}
                        onChange={(e) => handlePlotSelect(e.target.value)}
                        placeholder="Select Plot Number"
                        isDisabled={!formData.layout}
                      >
                        {filteredPlotRecords.map((plot: any) => (
                          <option key={plot.id} value={plot.plotNumber}>{plot.plotNumber}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Plot Size (sq ft)</FormLabel>
                      <Input
                        type="number"
                        value={formData.area}
                        isReadOnly
                        bg="gray.50"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Guideline Value per Sq Ft (₹)</FormLabel>
                      <Input
                        type="number"
                        value={formData.guidelineValue}
                        isReadOnly
                        bg="gray.50"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Total Cost (₹)</FormLabel>
                      <Input
                        type="number"
                        value={formData.totalCost}
                        isReadOnly
                        bg="gray.50"
                      />
                    </FormControl>

                    <FormControl isRequired isDisabled={isLocked}>
                      <FormLabel>Mode of Purchase</FormLabel>
                      <Select
                        value={formData.modeOfPurchase}
                        onChange={(e) => {
                          setFormData({ ...formData, modeOfPurchase: e.target.value as 'Own Funds' | 'Loan' });
                          if (e.target.value === 'Loan') {
                            toast({
                              title: 'Loan Option Selected',
                              description: 'CRM will be notified upon submission',
                              status: 'info',
                              duration: 3000,
                            });
                          }
                        }}
                      >
                        <option value="Own Funds">Own Funds</option>
                        <option value="Loan">Loan</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired isDisabled={isLocked}>
                      <FormLabel>Language to be used in Sale Deed</FormLabel>
                      <Select
                        value={formData.languageForSaleDeed}
                        onChange={(e) => setFormData({ ...formData, languageForSaleDeed: e.target.value as 'Tamil' | 'English' })}
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  {formData.modeOfPurchase === 'Loan' && (
                    <>
                      <Divider />
                      <Heading size="sm">Loan Details</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired isDisabled={isLocked}>
                          <FormLabel>Bank Name</FormLabel>
                          <Input
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          />
                        </FormControl>

                        <FormControl isRequired isDisabled={isLocked}>
                          <FormLabel>Bank Branch</FormLabel>
                          <Input
                            value={formData.bankBranch}
                            onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                          />
                        </FormControl>

                        <FormControl isRequired isDisabled={isLocked}>
                          <FormLabel>Loan Amount (₹)</FormLabel>
                          <Input
                            type="number"
                            value={formData.loanAmount}
                            onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                          />
                        </FormControl>
                      </SimpleGrid>
                    </>
                  )}
                </>
              )}

              {/* Step 2: Buyer Details */}
              {currentStep === 2 && (
                <>
                  <HStack justify="space-between">
                    <Heading size="md">Buyer Details</Heading>
                    {!isLocked && (
                      <Button
                        leftIcon={<FiPlus />}
                        colorScheme="blue"
                        size="sm"
                        onClick={addBuyer}
                      >
                        Add Buyer
                      </Button>
                    )}
                  </HStack>

                  {buyers.map((buyer, index) => (
                    <Card key={buyer.id} variant="outline" bg="gray.50">
                      <CardBody>
                        <HStack justify="space-between" mb={4}>
                          <Badge colorScheme="blue" fontSize="md">Buyer {index + 1}</Badge>
                          {buyers.length > 1 && !isLocked && (
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label="Remove buyer"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removeBuyer(buyer.id)}
                            />
                          )}
                        </HStack>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Buyer Type</FormLabel>
                            <Select
                              value={buyer.buyerType}
                              onChange={(e) => updateBuyer(buyer.id, 'buyerType', e.target.value)}
                            >
                              <option value="Indian">Indian</option>
                              <option value="NRI">NRI</option>
                            </Select>
                          </FormControl>

                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Buyer Name</FormLabel>
                            <Input
                              value={buyer.buyerName}
                              onChange={(e) => updateBuyer(buyer.id, 'buyerName', e.target.value)}
                            />
                          </FormControl>

                          <FormControl isDisabled={isLocked}>
                            <FormLabel>Buyer Name (Tamil)</FormLabel>
                            <Input
                              value={buyer.buyerNameTamil}
                              onChange={(e) => updateBuyer(buyer.id, 'buyerNameTamil', e.target.value)}
                              placeholder="வாங்குபவர் பெயர்"
                            />
                          </FormControl>

                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Age</FormLabel>
                            <Input
                              type="number"
                              value={buyer.buyerAge || ''}
                              onChange={(e) => updateBuyer(buyer.id, 'buyerAge', parseInt(e.target.value) || 0)}
                            />
                          </FormControl>

                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Parent/Guardian Name</FormLabel>
                            <Input
                              value={buyer.parentName}
                              onChange={(e) => updateBuyer(buyer.id, 'parentName', e.target.value)}
                            />
                          </FormControl>

                          <FormControl isDisabled={isLocked}>
                            <FormLabel>Parent/Guardian Name (Tamil)</FormLabel>
                            <Input
                              value={buyer.parentNameTamil}
                              onChange={(e) => updateBuyer(buyer.id, 'parentNameTamil', e.target.value)}
                              placeholder="பெற்றோர் பெயர்"
                            />
                          </FormControl>

                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Mobile Number</FormLabel>
                            <Input
                              type="tel"
                              value={buyer.buyerMobile}
                              onChange={(e) => updateBuyer(buyer.id, 'buyerMobile', e.target.value)}
                            />
                          </FormControl>

                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Email</FormLabel>
                            <Input
                              type="email"
                              value={buyer.buyerEmail}
                              onChange={(e) => updateBuyer(buyer.id, 'buyerEmail', e.target.value)}
                            />
                          </FormControl>

                          {buyer.buyerType === 'Indian' ? (
                            <>
                              <FormControl isRequired isDisabled={isLocked}>
                                <FormLabel>Aadhaar Number</FormLabel>
                                <Input
                                  value={buyer.aadhaar}
                                  onChange={(e) => updateBuyer(buyer.id, 'aadhaar', e.target.value)}
                                  placeholder="XXXX-XXXX-XXXX"
                                  maxLength={14}
                                />
                              </FormControl>

                              <FormControl isRequired isDisabled={isLocked}>
                                <FormLabel>PAN Number</FormLabel>
                                <Input
                                  value={buyer.pan}
                                  onChange={(e) => updateBuyer(buyer.id, 'pan', e.target.value.toUpperCase())}
                                  placeholder="ABCDE1234F"
                                  maxLength={10}
                                />
                              </FormControl>
                            </>
                          ) : (
                            <FormControl isRequired isDisabled={isLocked}>
                              <FormLabel>Passport Number</FormLabel>
                              <Input
                                value={buyer.passport}
                                onChange={(e) => updateBuyer(buyer.id, 'passport', e.target.value)}
                                placeholder="Enter passport number"
                              />
                            </FormControl>
                          )}
                        </SimpleGrid>

                        <FormControl isRequired mt={4} isDisabled={isLocked}>
                          <FormLabel>Address</FormLabel>
                          <Textarea
                            value={buyer.buyerAddress}
                            onChange={(e) => updateBuyer(buyer.id, 'buyerAddress', e.target.value)}
                            rows={3}
                          />
                        </FormControl>

                        <Divider my={4} />

                        <Heading size="sm" mb={3}>Document Upload</Heading>
                        <Text fontSize="xs" color="gray.600" mb={4}>
                          Accepted formats: PDF, JPEG, PNG | Max size: 20MB
                        </Text>

                        {buyer.buyerType === 'Indian' ? (
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl isRequired isDisabled={isLocked}>
                              <FormLabel>Aadhaar Card</FormLabel>
                              <HStack>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  style={{ display: 'none' }}
                                  ref={(el) => aadhaarInputRefs.current[buyer.id] = el}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(buyer.id, 'aadhaar', file);
                                  }}
                                />
                                <Button
                                  leftIcon={<FiUpload />}
                                  size="sm"
                                  onClick={() => aadhaarInputRefs.current[buyer.id]?.click()}
                                  isDisabled={isLocked}
                                >
                                  Upload
                                </Button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  style={{ display: 'none' }}
                                  ref={(el) => cameraInputRefs.current[`${buyer.id}-aadhaar`] = el}
                                  onChange={(e) => handleCameraCapture(buyer.id, 'aadhaar', e)}
                                />
                                <Button
                                  leftIcon={<FiCamera />}
                                  size="sm"
                                  onClick={() => cameraInputRefs.current[`${buyer.id}-aadhaar`]?.click()}
                                  isDisabled={isLocked}
                                >
                                  Camera
                                </Button>
                              </HStack>
                              {buyer.aadhaarFile && (
                                <Text fontSize="xs" color="green.600" mt={1}>
                                  ✓ {buyer.aadhaarFile.name}
                                </Text>
                              )}
                            </FormControl>

                            <FormControl isRequired isDisabled={isLocked}>
                              <FormLabel>PAN Card</FormLabel>
                              <HStack>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  style={{ display: 'none' }}
                                  ref={(el) => panInputRefs.current[buyer.id] = el}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(buyer.id, 'pan', file);
                                  }}
                                />
                                <Button
                                  leftIcon={<FiUpload />}
                                  size="sm"
                                  onClick={() => panInputRefs.current[buyer.id]?.click()}
                                  isDisabled={isLocked}
                                >
                                  Upload
                                </Button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  style={{ display: 'none' }}
                                  ref={(el) => cameraInputRefs.current[`${buyer.id}-pan`] = el}
                                  onChange={(e) => handleCameraCapture(buyer.id, 'pan', e)}
                                />
                                <Button
                                  leftIcon={<FiCamera />}
                                  size="sm"
                                  onClick={() => cameraInputRefs.current[`${buyer.id}-pan`]?.click()}
                                  isDisabled={isLocked}
                                >
                                  Camera
                                </Button>
                              </HStack>
                              {buyer.panFile && (
                                <Text fontSize="xs" color="green.600" mt={1}>
                                  ✓ {buyer.panFile.name}
                                </Text>
                              )}
                            </FormControl>
                          </SimpleGrid>
                        ) : (
                          <FormControl isRequired isDisabled={isLocked}>
                            <FormLabel>Passport</FormLabel>
                            <HStack>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                style={{ display: 'none' }}
                                ref={(el) => passportInputRefs.current[buyer.id] = el}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(buyer.id, 'passport', file);
                                }}
                              />
                              <Button
                                leftIcon={<FiUpload />}
                                size="sm"
                                onClick={() => passportInputRefs.current[buyer.id]?.click()}
                                isDisabled={isLocked}
                              >
                                Upload
                              </Button>
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                                ref={(el) => cameraInputRefs.current[`${buyer.id}-passport`] = el}
                                onChange={(e) => handleCameraCapture(buyer.id, 'passport', e)}
                              />
                              <Button
                                leftIcon={<FiCamera />}
                                size="sm"
                                onClick={() => cameraInputRefs.current[`${buyer.id}-passport`]?.click()}
                                isDisabled={isLocked}
                              >
                                Camera
                              </Button>
                            </HStack>
                            {buyer.passportFile && (
                              <Text fontSize="xs" color="green.600" mt={1}>
                                ✓ {buyer.passportFile.name}
                              </Text>
                            )}
                          </FormControl>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <>
                  <Heading size="md">Review & Confirm</Heading>
                  
                  <Card variant="outline" bg="blue.50">
                    <CardBody>
                      <Heading size="sm" mb={3}>Property Details</Heading>
                      <SimpleGrid columns={2} spacing={3}>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Project:</Text>
                          <Text>{formData.project}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Phase:</Text>
                          <Text>{formData.layout}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Plot Number:</Text>
                          <Text>{formData.plotNumber}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Plot Size:</Text>
                          <Text>{formData.area} sq ft</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Total Cost:</Text>
                          <Text fontWeight="bold" color="green.600">₹{formData.totalCost}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Purchase Mode:</Text>
                          <Text>{formData.modeOfPurchase}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">Sale Deed Language:</Text>
                          <Text>{formData.languageForSaleDeed}</Text>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>

                  <Card variant="outline" bg="green.50">
                    <CardBody>
                      <Heading size="sm" mb={3}>Buyer Information</Heading>
                      {buyers.map((buyer, index) => (
                        <Box key={buyer.id} mb={4}>
                          <Badge colorScheme="green" mb={2}>Buyer {index + 1}</Badge>
                          <SimpleGrid columns={2} spacing={2}>
                            <Box>
                              <Text fontSize="xs" fontWeight="bold" color="gray.600">Name:</Text>
                              <Text fontSize="sm">{buyer.buyerName}</Text>
                            </Box>
                            {buyer.buyerNameTamil && (
                              <Box>
                                <Text fontSize="xs" fontWeight="bold" color="gray.600">Name (Tamil):</Text>
                                <Text fontSize="sm">{buyer.buyerNameTamil}</Text>
                              </Box>
                            )}
                            <Box>
                              <Text fontSize="xs" fontWeight="bold" color="gray.600">Type:</Text>
                              <Text fontSize="sm">{buyer.buyerType}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" fontWeight="bold" color="gray.600">Age:</Text>
                              <Text fontSize="sm">{buyer.buyerAge}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" fontWeight="bold" color="gray.600">Mobile:</Text>
                              <Text fontSize="sm">{buyer.buyerMobile}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="xs" fontWeight="bold" color="gray.600">Email:</Text>
                              <Text fontSize="sm">{buyer.buyerEmail}</Text>
                            </Box>
                          </SimpleGrid>
                          {index < buyers.length - 1 && <Divider my={3} />}
                        </Box>
                      ))}
                    </CardBody>
                  </Card>

                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Important Notice</AlertTitle>
                      <AlertDescription>
                        By submitting this order, you acknowledge that all information provided is accurate. 
                        {formData.modeOfPurchase === 'Loan' && ' CRM will be notified regarding your loan requirement.'}
                        {user?.role === 'CRM' && ' Gmail OTP verification is required to submit on behalf of customer.'}
                      </AlertDescription>
                    </Box>
                  </Alert>
                </>
              )}

              <HStack justify="space-between" mt={6}>
                <Button
                  onClick={handlePrevious}
                  isDisabled={currentStep === 1 || isLocked}
                >
                  Previous
                </Button>
                
                <HStack>
                  {currentStep < 3 ? (
                    <Button
                      onClick={handleNext}
                      colorScheme="blue"
                      isDisabled={isLocked}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      colorScheme="green"
                      isDisabled={isLocked}
                    >
                      Submit Order
                    </Button>
                  )}
                </HStack>
              </HStack>
            </VStack>
          </Box>
        </CardBody>
      </Card>

      {/* OTP Modal */}
      <Modal isOpen={isOtpOpen} onClose={onOtpClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify Customer Email OTP</ModalHeader>
          <ModalBody>
            <Text fontSize="sm" mb={4}>
              An OTP has been sent to the customer's email address. Please enter the OTP to verify and submit the order.
            </Text>
            <FormControl>
              <FormLabel>Enter OTP</FormLabel>
              <Input
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </FormControl>
            <Text fontSize="xs" color="gray.500" mt={2}>
              Demo OTP: 123456
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onOtpClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={verifyOTP}>
              Verify OTP
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
