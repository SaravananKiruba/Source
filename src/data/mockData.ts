import { User, Booking, Payment, PaymentMilestone, RegistrationRequest, RegistrarSlot, AuditLog, DocumentHandover } from '../types';

export const mockUsers: User[] = [
  { id: 'U001', email: 'admin@abiestates.com', name: 'Admin User', role: 'Admin' },
  { id: 'U002', email: 'sales@abiestates.com', name: 'Sales Executive', role: 'Sales' },
  { id: 'U003', email: 'accounts@abiestates.com', name: 'Accounts Manager', role: 'Accounts' },
  { id: 'U004', email: 'legal@abiestates.com', name: 'Legal Advisor', role: 'Legal' },
  { id: 'U005', email: 'logistics@abiestates.com', name: 'Logistics Officer', role: 'Logistics' },
];

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    bookingDate: '2025-11-01',
    customerName: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    mobile: '9876543210',
    address: '123 Anna Nagar, Chennai - 600040',
    modeOfPurchase: 'Own Funds',
    project: 'Green Valley Heights',
    layout: 'Phase 1',
    plotNumber: 'P-101',
    area: 1200,
    totalCost: 3600000,
    status: 'Booked - Payment Confirmed',
    createdBy: 'Sales Executive',
    createdAt: '2025-11-01T10:30:00',
    updatedAt: '2025-11-02T14:20:00',
    updatedBy: 'Accounts Manager'
  },
  {
    id: 'BK002',
    bookingDate: '2025-11-05',
    customerName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    mobile: '9876543211',
    address: '456 T Nagar, Chennai - 600017',
    modeOfPurchase: 'Loan',
    project: 'Silver Oak Gardens',
    layout: 'Phase 2',
    plotNumber: 'P-205',
    area: 1500,
    totalCost: 4500000,
    status: 'Booked - Payment Confirmed',
    createdBy: 'Sales Executive',
    createdAt: '2025-11-05T11:15:00',
    updatedAt: '2025-11-06T09:30:00',
    updatedBy: 'Sales Executive'
  },
  {
    id: 'BK003',
    bookingDate: '2025-11-10',
    customerName: 'Suresh Babu',
    email: 'suresh.b@email.com',
    mobile: '9876543212',
    address: '789 Velachery, Chennai - 600042',
    modeOfPurchase: 'Own Funds',
    project: 'Green Valley Heights',
    layout: 'Phase 1',
    plotNumber: 'P-103',
    area: 1000,
    totalCost: 3000000,
    status: 'Booked - Pending Payment',
    createdBy: 'Sales Executive',
    createdAt: '2025-11-10T16:45:00',
    updatedAt: '2025-11-10T16:45:00',
    updatedBy: 'Sales Executive'
  },
  {
    id: 'BK004',
    bookingDate: '2025-11-12',
    customerName: 'Lakshmi Devi',
    email: 'lakshmi.d@email.com',
    mobile: '9876543213',
    address: '321 Adyar, Chennai - 600020',
    modeOfPurchase: 'Loan',
    project: 'Golden Meadows',
    layout: 'Phase 1',
    plotNumber: 'P-110',
    area: 1800,
    totalCost: 5400000,
    status: 'Booked - Payment Confirmed',
    createdBy: 'Sales Executive',
    createdAt: '2025-11-12T10:00:00',
    updatedAt: '2025-11-13T11:20:00',
    updatedBy: 'Accounts Manager'
  },
  {
    id: 'BK005',
    bookingDate: '2025-11-15',
    customerName: 'Anand Krishnan',
    email: 'anand.k@email.com',
    mobile: '9876543214',
    address: '555 Porur, Chennai - 600116',
    modeOfPurchase: 'Own Funds',
    project: 'Silver Oak Gardens',
    layout: 'Phase 3',
    plotNumber: 'P-301',
    area: 2000,
    totalCost: 6000000,
    status: 'Booked - Pending Payment',
    createdBy: 'Sales Executive',
    createdAt: '2025-11-15T14:30:00',
    updatedAt: '2025-11-15T14:30:00',
    updatedBy: 'Sales Executive'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    bookingId: 'BK001',
    receiptNumber: 'RCP-2025-001',
    amount: 360000,
    paymentMode: 'Razorpay',
    paymentDate: '2025-11-02',
    razorpayOrderId: 'order_MZK8hGfDR3bL9k',
    razorpayPaymentId: 'pay_MZK9RQjK5hD4wP',
    status: 'Success',
    createdAt: '2025-11-02T14:20:00',
    createdBy: 'Rajesh Kumar'
  },
  {
    id: 'PAY002',
    bookingId: 'BK002',
    receiptNumber: 'RCP-2025-002',
    amount: 450000,
    paymentMode: 'Cheque',
    paymentDate: '2025-11-06',
    chequeNumber: 'CHQ123456',
    reference: 'HDFC Bank',
    status: 'Success',
    createdAt: '2025-11-06T09:30:00',
    createdBy: 'Priya Sharma'
  },
  {
    id: 'PAY003',
    bookingId: 'BK004',
    receiptNumber: 'RCP-2025-003',
    amount: 540000,
    paymentMode: 'RTGS/NEFT',
    paymentDate: '2025-11-13',
    utrNumber: 'UTR9876543210',
    reference: 'ICICI Bank',
    status: 'Success',
    createdAt: '2025-11-13T11:20:00',
    createdBy: 'Lakshmi Devi'
  }
];

export const mockMilestones: PaymentMilestone[] = [
  {
    id: 'ML001',
    bookingId: 'BK001',
    description: 'Booking Advance (10%)',
    amount: 360000,
    dueDate: '2025-11-02',
    status: 'Paid',
    paidDate: '2025-11-02',
    paidAmount: 360000
  },
  {
    id: 'ML002',
    bookingId: 'BK001',
    description: 'On Agreement (40%)',
    amount: 1440000,
    dueDate: '2025-12-01',
    status: 'Pending'
  },
  {
    id: 'ML003',
    bookingId: 'BK001',
    description: 'On Registration (50%)',
    amount: 1800000,
    dueDate: '2026-01-15',
    status: 'Pending'
  },
  {
    id: 'ML004',
    bookingId: 'BK002',
    description: 'Booking Advance (10%)',
    amount: 450000,
    dueDate: '2025-11-06',
    status: 'Paid',
    paidDate: '2025-11-06',
    paidAmount: 450000
  },
  {
    id: 'ML005',
    bookingId: 'BK002',
    description: 'On Loan Approval (40%)',
    amount: 1800000,
    dueDate: '2025-11-25',
    status: 'Pending'
  },
  {
    id: 'ML006',
    bookingId: 'BK003',
    description: 'Booking Advance (10%)',
    amount: 300000,
    dueDate: '2025-11-10',
    status: 'Pending'
  }
];

export const mockRegistrations: RegistrationRequest[] = [
  {
    id: 'REG001',
    bookingId: 'BK001',
    requestDate: '2025-11-08',
    preferredRegDate: '2025-12-05',
    documentCount: 3,
    language: 'English',
    buyerName: 'Rajesh Kumar',
    buyerAge: 42,
    aadhaar: '****-****-1234',
    pan: 'ABCDE1234F',
    parentName: 'Kumar Swamy',
    buyerAddress: '123 Anna Nagar, Chennai - 600040',
    buyerMobile: '9876543210',
    buyerEmail: 'rajesh.kumar@email.com',
    paymentMode: 'Own Funds',
    status: 'Approved',
    financiallyCleared: true,
    registrationFee: 50000,
    registrationFeePaid: true,
    tokenAssigned: true,
    tokenNumber: 'TKN-001',
    tokenDate: '2025-12-05',
    tokenTime: '10:30 AM',
    registrarOffice: 'Chennai Sub-Registrar Office',
    createdAt: '2025-11-08T09:00:00',
    createdBy: 'Sales Executive',
    updatedAt: '2025-11-10T15:30:00',
    approvedBy: 'Legal Advisor',
    approvedAt: '2025-11-10T15:30:00'
  },
  {
    id: 'REG002',
    bookingId: 'BK002',
    requestDate: '2025-11-11',
    preferredRegDate: '2025-12-10',
    documentCount: 5,
    language: 'Tamil',
    buyerName: 'Priya Sharma',
    buyerAge: 35,
    aadhaar: '****-****-5678',
    pan: 'FGHIJ5678K',
    parentName: 'Sharma Venkat',
    buyerAddress: '456 T Nagar, Chennai - 600017',
    buyerMobile: '9876543211',
    buyerEmail: 'priya.sharma@email.com',
    paymentMode: 'Loan',
    bankName: 'HDFC Bank',
    bankBranch: 'T Nagar Branch',
    loanAmount: 3150000,
    status: 'Submitted',
    financiallyCleared: false,
    registrationFee: 55000,
    registrationFeePaid: false,
    tokenAssigned: false,
    createdAt: '2025-11-11T11:30:00',
    createdBy: 'Sales Executive',
    updatedAt: '2025-11-11T11:30:00'
  },
  {
    id: 'REG003',
    bookingId: 'BK004',
    requestDate: '2025-11-14',
    preferredRegDate: '2025-12-15',
    documentCount: 4,
    language: 'Tamil',
    buyerName: 'Lakshmi Devi',
    buyerAge: 38,
    aadhaar: '****-****-9012',
    pan: 'KLMNO9012P',
    parentName: 'Devi Rajan',
    buyerAddress: '321 Adyar, Chennai - 600020',
    buyerMobile: '9876543213',
    buyerEmail: 'lakshmi.d@email.com',
    paymentMode: 'Loan',
    bankName: 'ICICI Bank',
    bankBranch: 'Adyar Branch',
    loanAmount: 3780000,
    status: 'Draft',
    financiallyCleared: false,
    tokenAssigned: false,
    createdAt: '2025-11-14T16:00:00',
    createdBy: 'Sales Executive',
    updatedAt: '2025-11-14T16:00:00'
  }
];

export const mockSlots: RegistrarSlot[] = [
  {
    id: 'SLT001',
    date: '2025-12-05',
    time: '10:30 AM',
    office: 'Chennai Sub-Registrar Office',
    tokenNumber: 'TKN-001',
    status: 'Confirmed',
    registrationId: 'REG001'
  },
  {
    id: 'SLT002',
    date: '2025-12-05',
    time: '11:00 AM',
    office: 'Chennai Sub-Registrar Office',
    tokenNumber: 'TKN-002',
    status: 'Available'
  },
  {
    id: 'SLT003',
    date: '2025-12-05',
    time: '02:00 PM',
    office: 'Chennai Sub-Registrar Office',
    tokenNumber: 'TKN-003',
    status: 'Available'
  },
  {
    id: 'SLT004',
    date: '2025-12-10',
    time: '10:00 AM',
    office: 'Tambaram Sub-Registrar Office',
    tokenNumber: 'TKN-004',
    status: 'Available'
  },
  {
    id: 'SLT005',
    date: '2025-12-10',
    time: '11:30 AM',
    office: 'Tambaram Sub-Registrar Office',
    tokenNumber: 'TKN-005',
    status: 'Available'
  },
  {
    id: 'SLT006',
    date: '2025-12-15',
    time: '09:30 AM',
    office: 'Chennai Sub-Registrar Office',
    tokenNumber: 'TKN-006',
    status: 'Available'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD001',
    timestamp: '2025-11-01T10:30:00',
    userId: 'U002',
    userName: 'Sales Executive',
    action: 'Created',
    entity: 'Booking',
    entityId: 'BK001',
    details: 'New booking created for Rajesh Kumar'
  },
  {
    id: 'AUD002',
    timestamp: '2025-11-02T14:20:00',
    userId: 'U003',
    userName: 'Accounts Manager',
    action: 'Payment Confirmed',
    entity: 'Payment',
    entityId: 'PAY001',
    details: 'Razorpay payment of ₹360,000 confirmed for booking BK001'
  },
  {
    id: 'AUD003',
    timestamp: '2025-11-08T09:00:00',
    userId: 'U002',
    userName: 'Sales Executive',
    action: 'Created',
    entity: 'Registration Request',
    entityId: 'REG001',
    details: 'Registration request created for booking BK001'
  },
  {
    id: 'AUD004',
    timestamp: '2025-11-10T15:30:00',
    userId: 'U004',
    userName: 'Legal Advisor',
    action: 'Approved',
    entity: 'Registration Request',
    entityId: 'REG001',
    details: 'Registration request REG001 approved'
  },
  {
    id: 'AUD005',
    timestamp: '2025-11-10T15:45:00',
    userId: 'U004',
    userName: 'Legal Advisor',
    action: 'Token Assigned',
    entity: 'Registration Request',
    entityId: 'REG001',
    details: 'Token TKN-001 assigned for 2025-12-05 at 10:30 AM'
  }
];

export const mockDocumentHandovers: DocumentHandover[] = [
  {
    id: 'DOC001',
    registrationId: 'REG001',
    customerName: 'Rajesh Kumar',
    handoverDate: '2025-12-05',
    method: 'Physical',
    remarks: 'Documents handed over in person',
    receivedBy: 'Rajesh Kumar',
    createdAt: '2025-12-05T16:00:00',
    createdBy: 'Logistics Officer'
  }
];
