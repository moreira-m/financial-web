export interface Account {
    id: number;
    name: string;
    type: string;
    pluggyAccountId: string;
}

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    accountName: string;
}

export interface DashboardSummary {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
}

