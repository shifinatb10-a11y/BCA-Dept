export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export type EventCategory = 
  | 'Hackathon' 
  | 'Workshop' 
  | 'Seminar' 
  | 'Guest Lecture' 
  | 'Tech Fest' 
  | 'Cultural' 
  | 'Sports' 
  | 'Orientation';

export interface AgendaItem {
  id: string;
  time: string;
  activity: string;
  speaker?: string;
  venue?: string;
}

export interface DepartmentEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  date: string; // ISO date e.g. "2026-09-20"
  time: string; // e.g. "09:30 AM - 04:30 PM"
  venue: string;
  status: EventStatus;
  coordinator: string;
  speaker?: string;
  speakerRole?: string;
  bannerUrl: string;
  registrationUrl?: string;
  registrationFee?: number; // 0 for free
  maxSeats?: number;
  registeredCount?: number;
  agenda?: AgendaItem[];
  // For completed events
  recap?: {
    summary: string;
    highlights: string[];
    attendeeCount: number;
    winners?: string[];
    reportUrl?: string;
    photoUrls?: string[];
  };
  createdAt: string;
}

export type MediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  url: string; // Direct image URL or YouTube/MP4 URL
  thumbnailUrl?: string;
  category: string; // 'Hackathons' | 'Workshops' | 'Campus Life' | 'Guest Lectures' | 'Sports' | 'Cultural'
  eventId?: string; // Optional linkage to an event
  eventName?: string;
  date: string;
  featured?: boolean;
  createdAt: string;
}

export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';

export type TransactionStatus = 'completed' | 'pending' | 'reimbursed';

export interface FinancialTransaction {
  id: string;
  title: string;
  type: TransactionType;
  category: string; // e.g., 'Event Registration', 'College Grant', 'Sponsorship', 'Guest Honorarium', 'Refreshments', 'Prizes & Trophies', 'Lab Equipment', 'Banners & Printing'
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  payerPayee: string; // Who paid or who received
  receiptRef?: string;
  budgetId?: string; // Associated budget allocation
  eventId?: string; // Associated event if applicable
  notes?: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface BudgetAllocation {
  id: string;
  fiscalYear: string; // e.g. "2026-2027"
  title: string;
  allocatedAmount: number;
  spentAmount: number;
  notes?: string;
  category: string;
  createdAt: string;
}

export interface DepartmentStats {
  totalStudents: number;
  facultyCount: number;
  eventsCompleted: number;
  activeClubs: number;
  placementRate: number; // e.g. 94%
  labSystemsCount: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  photoUrl: string;
  experienceYears: number;
}
