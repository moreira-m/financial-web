export interface Account {
    id: number;
    name: string;
    type: string;
    pluggyAccountId: string;
}

export interface Category {
    id: number;
    name: string;
    color: string;
    includeInDashboard: boolean;
}

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    accountName: string;
    categoryId?: number;
    categoryName?: string;
    categoryColor?: string;
}

export interface DashboardSummary {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
}

