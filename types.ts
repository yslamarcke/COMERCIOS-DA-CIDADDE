export enum TransactionType {
  DEBT = 'DEBT',
  PAYMENT = 'PAYMENT' // Kept for compatibility, but we will mostly use DEBT as "Item"
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
  type: TransactionType;
}

export interface Debtor {
  id: string;
  name: string;
  phone?: string;
  transactions: Transaction[];
  updatedAt: string;
}

export interface AIParsedTransaction {
  name: string;
  amount: number;
  description: string;
}

// Stats interface for charts
export interface DebtStats {
  totalOwed: number;
  totalPeople: number;
  topDebtor: string;
}