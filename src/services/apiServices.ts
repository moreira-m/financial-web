import { apiFetch } from '../lib/api';
import { Account, Transaction, DashboardSummary, Category } from '../types';

export const apiService = {
    getAccounts: (): Promise<Account[]> => {
        return apiFetch<Account[]>('/accounts');
    },

    syncAccount: (pluggyAccountId: string): Promise<string> => {
        return apiFetch<string>('/transactions/sync/' + pluggyAccountId, {
            method: 'POST',
        });
    },

    getTransactions: (startDate: string, endDate: string): Promise<Transaction[]> => {
        return apiFetch<Transaction[]>(`/transactions?startDate=${startDate}&endDate=${endDate}`);
    },

    updateTransactionCategory: (transactionId: number, categoryId: number | null): Promise<Transaction> => {
        return apiFetch<Transaction>(`/transactions/${transactionId}/category`, {
            method: 'PATCH',
            body: JSON.stringify({ categoryId }),
        });
    },

    getDashboardSummary: (startDate: string, endDate: string): Promise<DashboardSummary> => {
        return apiFetch<DashboardSummary>(`/dashboard/summary?startDate=${startDate}&endDate=${endDate}`);
    },

    importAccounts: async (itemId: string): Promise<void> => {
        return apiFetch<void>('/accounts/import/' + itemId, {
            method: 'POST',
        });
    },

    getCategories: (): Promise<Category[]> => {
        return apiFetch<Category[]>('/categories');
    },

    createCategory: (category: Omit<Category, 'id'>): Promise<Category> => {
        return apiFetch<Category>('/categories', {
            method: 'POST',
            body: JSON.stringify(category),
        });
    },

    updateCategory: (id: number, category: Omit<Category, 'id'>): Promise<Category> => {
        return apiFetch<Category>(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(category),
        });
    },

    deleteCategory: (id: number): Promise<void> => {
        return apiFetch<void>(`/categories/${id}`, {
            method: 'DELETE',
        });
    }
};
