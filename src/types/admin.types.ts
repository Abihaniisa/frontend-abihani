export interface PlatformMetrics {
  usersToday: number;
  usersTotal: number;
  ordersToday: number;
  ordersTotal: number;
  gmvToday: number;
  gmvTotal: number;
  openDisputes: number;
  revenueGenerated: number;
  openTickets: number;
  openReports: number;
  doneOrdersCount: number;
  cancelledOrdersCount: number;
}

export interface JournalEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userHandle: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  messages: Array<{
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}
