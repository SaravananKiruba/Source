export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Finance' | 'BusinessOwner' | 'CRM' | 'Sales' | 'Legal' | 'HR' | 'User';
}

export interface BuyerDetail {
  id: string;
  buyerType: 'Indian' | 'NRI';
  buyerName: string;
  buyerNameTamil?: string;
  buyerAge: number;
  aadhaar?: string;
  pan?: string;
  passport?: string;
  parentName: string;
  parentNameTamil?: string;
  buyerAddress: string;
  buyerMobile: string;
  buyerEmail: string;
  aadhaarFile?: File | null;
  panFile?: File | null;
  passportFile?: File | null;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  modeOfPurchase: 'Own Funds' | 'Loan';
  project: string;
  layout: string;
  plotNumber: string;
  area: number;
  totalCost: number;
  guidelineValuePerSqft: number;
  status: 'Order - Pending Payment' | 'Order - Payment Confirmed' | 'Order - In Progress' | 'Order - Completed';
  buyers: BuyerDetail[];
  languageForSaleDeed: 'Tamil' | 'English';
  bankName?: string;
  bankBranch?: string;
  loanAmount?: number;
  crmName?: string;
  crmPhone?: string;
  crmNotified?: boolean;
  isLocked: boolean;
  parentDocumentAvailable: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  receiptNumber: string;
  amount: number;
  paymentMode: 'Razorpay' | 'Cheque' | 'RTGS/NEFT' | 'Cash' | 'Bank Transfer';
  paymentDate: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  chequeNumber?: string;
  utrNumber?: string;
  reference?: string;
  status: 'Pending' | 'Success' | 'Failed' | 'Realization Pending';
  isRefundable: boolean;
  createdAt: string;
  createdBy: string;
}

export interface BankPaymentNotification {
  id: string;
  orderId: string;
  customerId: string;
  partyName: string;
  amount: number;
  bankAccountNumber: string;
  notificationDate: string;
  reference: string;
  notifiedBy: string;
  createdAt: string;
}

export interface PaymentMilestone {
  id: string;
  orderId: string;
  customerId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
  paidDate?: string;
  paidAmount?: number;
}

export interface PlotRecord {
  id: string;
  projectName: string;
  phaseName: string;
  plotNumber: string;
  plotSizeInSqft: number;
  guidelineValuePerSqft: number;
  crmName: string;
  crmPhone: string;
  pdGoogleDriveLocation: string;
  saGoogleDriveLocation: string;
  sdGoogleDriveLocation: string;
  bankAccountNumber: string;
  bankBranch: string;
  bankIFSC: string;
  isAvailable: boolean;
  createdAt: string;
  createdBy: string;
}

export interface OTPVerification {
  type: 'Google' | 'Mobile' | 'Aadhaar';
  identifier: string;
  otp: string;
  verified: boolean;
  timestamp: string;
}

export interface PaymentLink {
  id: string;
  orderId: string;
  customerId: string;
  customerEmail: string;
  amount: number;
  linkUrl: string;
  generatedBy: string;
  generatedAt: string;
  expiresAt: string;
  status: 'Active' | 'Used' | 'Expired';
}

export interface InProgressOrderReport {
  orderId: string;
  customerId: string;
  customerName: string;
  project: string;
  plotNumber: string;
  totalCost: number;
  amountPaid: number;
  amountPending: number;
  status: string;
  orderDate: string;
  lastPaymentDate?: string;
  daysOverdue: number;
}

export interface RegistrarSlot {
  id: string;
  date: string;
  time: string;
  office: string;
  tokenNumber: string;
  status: 'Available' | 'Reserved' | 'Confirmed' | 'Completed';
  orderId?: string;
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
  orderId: string;
  customerId: string;
  customerName: string;
  handoverDate: string;
  method: 'Physical' | 'Courier' | 'Email' | 'Other';
  remarks?: string;
  receivedBy?: string;
  createdAt: string;
  createdBy: string;
}

// Legacy type for backward compatibility
export interface Booking extends Order {}
export interface RegistrationRequest {
  id: string;
  orderId: string;
  status: string;
}
