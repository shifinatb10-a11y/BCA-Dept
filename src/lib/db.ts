import fs from 'fs';
import path from 'path';
import { DepartmentEvent, GalleryItem, FinancialTransaction, BudgetAllocation, FacultyMember, DepartmentStats } from './types';

export interface DatabaseSchema {
  collegeName: string;
  departmentName: string;
  location: string;
  affiliation: string;
  events: DepartmentEvent[];
  gallery: GalleryItem[];
  transactions: FinancialTransaction[];
  budgets: BudgetAllocation[];
  faculty: FacultyMember[];
  stats: DepartmentStats;
  admin: {
    username: string;
    passwordHash: string;
    updatedAt: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'bca_data.json');

export const INITIAL_DATA: DatabaseSchema = {
  collegeName: 'PSMO College (Autonomous)',
  departmentName: 'Department of Computer Applications (BCA)',
  location: 'Tirurangadi, Malappuram, Kerala - 676306',
  affiliation: 'Affiliated to University of Calicut | Re-accredited by NAAC with A+ Grade',
  admin: {
    username: 'admin@psmocollege.ac.in',
    passwordHash: 'admin123',
    updatedAt: new Date().toISOString(),
  },
  stats: {
    totalStudents: 180,
    facultyCount: 8,
    eventsCompleted: 28,
    activeClubs: 4,
    placementRate: 92,
    labSystemsCount: 65,
  },
  faculty: [
    {
      id: 'fac-1',
      name: 'Dr. Abdul Rasheed P.',
      designation: 'Head of Department & Assistant Professor',
      qualification: 'Ph.D in Computer Science, MCA',
      specialization: 'Artificial Intelligence, Machine Learning & Algorithms',
      email: 'bca.hod@psmocollege.ac.in',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experienceYears: 16,
    },
    {
      id: 'fac-2',
      name: 'Prof. Fathima Zahra K.',
      designation: 'Assistant Professor & Staff Advisor',
      qualification: 'M.Tech in Computer Science',
      specialization: 'Web Technologies, React, Next.js & Cloud Computing',
      email: 'fathima.bca@psmocollege.ac.in',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      experienceYears: 11,
    },
    {
      id: 'fac-3',
      name: 'Prof. Mohammed Shafi T.',
      designation: 'Assistant Professor & Lab In-charge',
      qualification: 'MCA, M.Phil',
      specialization: 'Database Management Systems, Python & Cyber Security',
      email: 'shafi.bca@psmocollege.ac.in',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experienceYears: 9,
    },
    {
      id: 'fac-4',
      name: 'Prof. Naseera Banu C.',
      designation: 'Assistant Professor & Association Coordinator',
      qualification: 'M.Sc Computer Science, NET',
      specialization: 'Operating Systems, Data Structures & Networking',
      email: 'naseera.bca@psmocollege.ac.in',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      experienceYears: 7,
    },
  ],
  events: [
    {
      id: 'evt-1',
      title: 'INNOVENTIA 2026: National Level Intercollegiate IT Fest',
      slug: 'innoventia-2026-it-fest',
      description: 'The flagship annual technical festival organized by the BCA Department of PSMO College (Autonomous), Tirurangadi. Features web designing, blind coding, gaming tournament, IT quiz, and paper presentation.',
      category: 'Tech Fest',
      date: '2026-10-22',
      time: '09:00 AM - 05:00 PM',
      venue: 'PSMO College Golden Jubilee Auditorium & BCA Lab',
      status: 'upcoming',
      coordinator: 'Prof. Mohammed Shafi & BCA Association',
      speaker: 'Habeeb Rahman (Tech Lead, Kerala Startup Mission)',
      speakerRole: 'Inaugural Keynote & Jury',
      bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://forms.google.com/psmo-innoventia2026',
      registrationFee: 150,
      maxSeats: 200,
      registeredCount: 115,
      agenda: [
        { id: 'ag-1', time: '09:00 AM', activity: 'Registration & Welcome Tea' },
        { id: 'ag-2', time: '09:45 AM', activity: 'Inaugural Function by College Principal & Chief Guest' },
        { id: 'ag-3', time: '10:30 AM', activity: 'CodeSprint (Debugging) & Web Design Prelims' },
        { id: 'ag-4', time: '01:00 PM', activity: 'Prayer & Lunch Break' },
        { id: 'ag-5', time: '02:00 PM', activity: 'Grand IT Quiz & Final Project Demos' },
        { id: 'ag-6', time: '04:00 PM', activity: 'Valedictory Session & Cash Prize Distribution' },
      ],
      createdAt: '2026-08-20T10:00:00Z',
    },
    {
      id: 'evt-2',
      title: 'Workshop: Full-Stack Web Development with React & Next.js',
      slug: 'workshop-react-nextjs',
      description: 'Hands-on practical bootcamp for 2nd and 3rd year BCA students focusing on modern frontend components, API integrations, and deploying production web applications.',
      category: 'Workshop',
      date: '2026-09-30',
      time: '10:00 AM - 03:30 PM',
      venue: 'BCA Air-Conditioned Computer Lab',
      status: 'upcoming',
      coordinator: 'Prof. Fathima Zahra K.',
      speaker: 'Sujith Kumar (Senior Full-Stack Consultant, Infopark Kochi)',
      speakerRole: 'Technical Instructor',
      bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      registrationUrl: 'https://forms.google.com/psmo-bca-react',
      registrationFee: 0,
      maxSeats: 50,
      registeredCount: 42,
      createdAt: '2026-08-25T11:00:00Z',
    },
    {
      id: 'evt-3',
      title: 'Seminar on Career Avenues in AI & Cloud Computing',
      slug: 'career-avenues-ai-cloud',
      description: 'Orientation on industry career paths for computer graduates, exploring emerging requirements in generative AI, cloud DevOps, and cyber security.',
      category: 'Seminar',
      date: '2026-10-08',
      time: '01:30 PM - 03:30 PM',
      venue: 'Seminar Hall 1, Main Block',
      status: 'upcoming',
      coordinator: 'Dr. Abdul Rasheed P.',
      speaker: 'Arun Varma (Cloud Solutions Architect, UST Global)',
      speakerRole: 'Guest Speaker',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      registrationFee: 0,
      createdAt: '2026-08-30T09:30:00Z',
    },
    {
      id: 'evt-4',
      title: 'BCA Association Inauguration & Freshers Welcome 2026',
      slug: 'bca-association-inauguration-2026',
      description: 'Official launch of the BCA Student Association activities for the academic year 2026-27 and welcoming 1st year students.',
      category: 'Orientation',
      date: '2026-08-12',
      time: '10:00 AM - 01:00 PM',
      venue: 'Golden Jubilee Seminar Hall',
      status: 'completed',
      coordinator: 'Prof. Naseera Banu C.',
      bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      recap: {
        summary: 'The BCA Association was formally inaugurated by the Principal Dr. K. Azeez. Office bearers took the oath, followed by cultural programs, a coding quiz, and welcoming of the 1st year BCA batch of 60 students.',
        highlights: [
          'Inauguration of student technical clubs: Web Innovators, Cyber Cell, and Coding League',
          'Release of the departmental academic calendar 2026-27',
          'Presentation of mementos to university semester toppers',
        ],
        attendeeCount: 175,
      },
      createdAt: '2026-07-20T09:00:00Z',
    },
    {
      id: 'evt-5',
      title: 'Cyber Security Awareness & Safe Campus Workshop',
      slug: 'cyber-security-safe-campus',
      description: 'Interactive session covering social engineering threats, digital privacy, secure passwords, and cyber laws in India.',
      category: 'Workshop',
      date: '2026-07-24',
      time: '10:30 AM - 01:00 PM',
      venue: 'BCA Smart Classroom',
      status: 'completed',
      coordinator: 'Prof. Mohammed Shafi T.',
      speaker: 'C. P. Musthafa (Sub-Inspector, Cyber Police Station, Malappuram)',
      speakerRole: 'Resource Person',
      bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      recap: {
        summary: 'Special interactive seminar organized in association with the Kerala Cyber Police wing. Students were demonstrated practical real-time threat detection and phishing defense tactics.',
        highlights: [
          'Over 110 students attended from BCA and BSc Computer Science streams',
          'Live simulation of phishing attacks and two-factor authentication safeguards',
          'Distribution of Cyber Safety Handbooks to student representatives',
        ],
        attendeeCount: 115,
        winners: ['Best Cyber Quiz Team: Shamna & Team (3rd Year BCA)'],
      },
      createdAt: '2026-06-25T10:00:00Z',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'BCA Smart Computer Lab Practical Session',
      description: 'Students working on programming assignments and lab experiments in the departmental computer laboratory.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
      category: 'Campus Life',
      date: '2026-08-18',
      featured: true,
      createdAt: '2026-08-19T10:00:00Z',
    },
    {
      id: 'gal-2',
      title: 'BCA Association Inauguration Ceremony',
      description: 'Principal and faculty lighting the traditional lamp during the Association Inaugural Meet at PSMO College.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      category: 'Campus Life',
      eventId: 'evt-4',
      eventName: 'BCA Association Inauguration',
      date: '2026-08-12',
      featured: true,
      createdAt: '2026-08-12T15:00:00Z',
    },
    {
      id: 'gal-3',
      title: 'Innoventia IT Fest Coding Sprint Preview',
      description: 'Students engaging in speed debugging and algorithm implementation.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      category: 'Hackathons',
      eventId: 'evt-1',
      eventName: 'INNOVENTIA 2026',
      date: '2026-08-05',
      featured: true,
      createdAt: '2026-08-05T12:00:00Z',
    },
    {
      id: 'gal-4',
      title: 'PSMO College BCA Department Tech Documentary & Overview',
      description: 'Video overview of our curriculum, laboratories, faculty guidance, and student achievements in Tirurangadi.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      category: 'Campus Life',
      date: '2026-07-30',
      featured: true,
      createdAt: '2026-07-30T18:00:00Z',
    },
    {
      id: 'gal-5',
      title: 'Cyber Security Safe Campus Workshop Session',
      description: 'Sub-Inspector C. P. Musthafa addressing BCA students on cyber hygiene and digital safety laws.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      category: 'Workshops',
      eventId: 'evt-5',
      eventName: 'Cyber Security Workshop',
      date: '2026-07-24',
      featured: false,
      createdAt: '2026-07-24T14:00:00Z',
    },
    {
      id: 'gal-6',
      title: 'PSMO College Campus Greens & BCA Block',
      description: 'Scenic view of the campus academic blocks in Tirurangadi.',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
      category: 'Campus Life',
      date: '2026-06-10',
      featured: false,
      createdAt: '2026-06-10T10:00:00Z',
    },
  ],
  budgets: [
    {
      id: 'bud-1',
      fiscalYear: '2026-2027',
      title: 'BCA Association Annual Technical Activities Fund',
      allocatedAmount: 120000,
      spentAmount: 48500,
      category: 'Department General Fund',
      notes: 'Approved by College Council for workshops, invited lectures, and association meet.',
      createdAt: '2026-06-01T00:00:00Z',
    },
    {
      id: 'bud-2',
      fiscalYear: '2026-2027',
      title: 'INNOVENTIA 2026 National IT Fest Allocation',
      allocatedAmount: 60000,
      spentAmount: 22000,
      category: 'Event Specific',
      notes: 'Prizes (₹30,000), food, stage arrangements, and participant kits.',
      createdAt: '2026-08-01T00:00:00Z',
    },
  ],
  transactions: [
    {
      id: 'tx-1',
      title: 'College Management Annual Department Allocation',
      type: 'income',
      category: 'College Grant',
      amount: 80000,
      date: '2026-06-15',
      paymentMethod: 'Bank Transfer',
      payerPayee: 'PSMO College Finance Office',
      receiptRef: 'PSMO/FIN/2026/089',
      budgetId: 'bud-1',
      notes: 'Annual departmental allocation for academic programs',
      status: 'completed',
      createdAt: '2026-06-15T11:00:00Z',
    },
    {
      id: 'tx-2',
      title: 'INNOVENTIA 2026 Co-Sponsorship Contribution',
      type: 'income',
      category: 'Sponsorship',
      amount: 25000,
      date: '2026-08-10',
      paymentMethod: 'UPI',
      payerPayee: 'NextGen IT Solutions, Calicut',
      receiptRef: 'SPON-NG-012',
      budgetId: 'bud-2',
      eventId: 'evt-1',
      notes: 'Title sponsorship for coding competition prizes',
      status: 'completed',
      createdAt: '2026-08-10T14:30:00Z',
    },
    {
      id: 'tx-3',
      title: 'BCA Association Inauguration Stage, Sound & Mementos',
      type: 'expense',
      category: 'Stage & Audio/Visual',
      amount: 14500,
      date: '2026-08-12',
      paymentMethod: 'Cash',
      payerPayee: 'City Audio & Stage Decorators, Tirurangadi',
      receiptRef: 'BILL-CAS-2026/12',
      budgetId: 'bud-1',
      eventId: 'evt-4',
      notes: 'PA system, flower decoration, mementos for guests',
      status: 'completed',
      createdAt: '2026-08-12T16:00:00Z',
    },
    {
      id: 'tx-4',
      title: 'High-Tea & Snacks for Association Inauguration',
      type: 'expense',
      category: 'Refreshments',
      amount: 8200,
      date: '2026-08-12',
      paymentMethod: 'UPI',
      payerPayee: 'PSMO Campus Canteen',
      receiptRef: 'CANTEEN-0812-BCA',
      budgetId: 'bud-1',
      eventId: 'evt-4',
      notes: 'Refreshments for 170 students and faculty',
      status: 'completed',
      createdAt: '2026-08-12T17:00:00Z',
    },
    {
      id: 'tx-5',
      title: 'INNOVENTIA 2026 Banners, Posters & Flyers Printing',
      type: 'expense',
      category: 'Banners & Printing',
      amount: 7500,
      date: '2026-08-20',
      paymentMethod: 'UPI',
      payerPayee: 'Al-Madina Digital Offset Press, Tirurangadi',
      receiptRef: 'ALM-INV-332',
      budgetId: 'bud-2',
      eventId: 'evt-1',
      notes: 'Flex banners and campus publicity posters',
      status: 'completed',
      createdAt: '2026-08-20T12:30:00Z',
    },
  ],
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDb(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
    return INITIAL_DATA;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return { ...INITIAL_DATA, ...data };
  } catch (error) {
    console.error('Error reading bca_data.json, returning initial:', error);
    return INITIAL_DATA;
  }
}

export function saveDb(data: DatabaseSchema): void {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving bca_data.json:', error);
    throw error;
  }
}
