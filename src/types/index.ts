export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Sales' | 'Accounts' | 'Legal' | 'Logistics' | 'Management';
}

export interface Booking {
  id: string;
  bookingDate: string;
  customerName: string;
  email: string;
  mobile: string;
  address: string;
  modeOfPurchase: 'Own Funds' | 'Loan';
  project: string;
  layout: string;
  plotNumber: string;
  area: number;
  totalCost: number;
  status: 'Booked - Pending Payment' | 'Booked - Payment Confirmed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  receiptNumber: string;
  amount: number;
  paymentMode: 'Razorpay' | 'Cheque' | 'RTGS/NEFT' | 'Cash';
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  chequeNumber?: string;
  utrNumber?: string;
  reference?: string;
  status: 'Pending' | 'Success' | 'Failed';
  createdAt: string;
  createdBy: string;
}

export interface PaymentMilestone {
  id: string;
  bookingId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
  paidDate?: string;
  paidAmount?: number;
}

export interface RegistrationRequest {
  id: string;
  bookingId: string;
  requestDate: string;
  preferredRegDate: string;
  documentCount: number;
  language: 'Tamil' | 'English';
  buyerName: string;
  buyerAge: number;
  aadhaar: string;
  pan: string;
  parentName: string;
  buyerAddress: string;
  buyerMobile: string;
  buyerEmail: string;
  paymentMode: 'Own Funds' | 'Loan';
  bankName?: string;
  bankBranch?: string;
  loanAmount?: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Completed';
  financiallyCleared: boolean;
  registrationFee?: number;
  registrationFeePaid?: boolean;
  tokenAssigned?: boolean;
  tokenNumber?: string;
  tokenDate?: string;
  tokenTime?: string;
  registrarOffice?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface RegistrarSlot {
  id: string;
  date: string;
  time: string;
  office: string;
  tokenNumber: string;
  status: 'Available' | 'Reserved' | 'Confirmed' | 'Completed';
  registrationId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface DocumentHandover {
  id: string;
  registrationId: string;
  customerName: string;
  handoverDate: string;
  method: 'Physical' | 'Courier' | 'Email' | 'Other';
  remarks?: string;
  receivedBy?: string;
  createdAt: string;
  createdBy: string;
}
