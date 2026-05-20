import { apiFetch } from '../lib/api';
import { Account, Transaction, DashboardSummary } from '../types';

export const apiService = {
    //lista as contas bancárias
    getAccounts: (): Promise<Account[]> => {
        return apiFetch<Account[]>('/accounts');
    },

    //dispara sincronizaçao de dados
    syncAccount: (pluggyAccountId: string): Promise<string> => {
        return apiFetch<string>(`/transactions/sync/${pluggyAccountId}`, {
            method: 'POST',
        });
    },

    //busca transaçoes
    getTransactions: (startDate: string, endDate: string): Promise<Transaction[]> => {
        return apiFetch<Transaction[]>(`/transactions?startDate=${startDate}&endDate=${endDate}`);
    },

    //busca resumo financeiro
    getDashboardSummary: (startDate: string, endDate: string): Promise<DashboardSummary> => {
        return apiFetch<DashboardSummary>(`/dashboard/summary?startDate=${startDate}&endDate=${endDate}`);
    }
};