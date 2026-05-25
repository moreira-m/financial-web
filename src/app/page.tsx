"use client";

import { useState, useEffect, useMemo } from "react";
import { apiService } from "../services/apiServices";
import { Account, Transaction, DashboardSummary, Category } from "../types";
import { Summary } from "../components/Summary";
import { AccountList } from "../components/AccountList";
import { TransactionList } from "../components/TransactionList";
import { PeriodFilter } from "../components/PeriodFilter";
import { DashboardFilters } from "../components/DashboardFilters";
import { CategoryManagerModal } from "../components/CategoryManagerModal";
import "./dashboard.scss";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");
        
        const [accountsData, transactionsData, categoriesData] = await Promise.all([
          apiService.getAccounts(),
          apiService.getTransactions(startDate, endDate),
          apiService.getCategories()
        ]);

        setAccounts(accountsData);
        setTransactions(transactionsData);
        setCategories(categoriesData);
        setSelectedCategoryIds(categoriesData.map(c => c.id));
      } catch (err) {
        console.error(err);
        setError("Falha na sincronização de dados [ERR_FETCH_FAILED]");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [startDate, endDate]);

  async function handleSync(pluggyAccountId: string) {
    try {
      setLoading(true);
      await apiService.syncAccount(pluggyAccountId);
      const [accountsData, transactionsData] = await Promise.all([
        apiService.getAccounts(),
        apiService.getTransactions(startDate, endDate)
      ]);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error(err);
      setError("Falha na sincronização da conta [ERR_SYNC_FAILED]");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCategory = async (category: Omit<Category, "id">) => {
    const newCategory = await apiService.createCategory(category);
    setCategories([...categories, newCategory]);
    setSelectedCategoryIds([...selectedCategoryIds, newCategory.id]);
  };

  const handleUpdateCategory = async (id: number, categoryDetails: Omit<Category, "id">) => {
    const updated = await apiService.updateCategory(id, categoryDetails);
    setCategories(categories.map(c => c.id === id ? updated : c));
  };

  const handleDeleteCategory = async (id: number) => {
    await apiService.deleteCategory(id);
    setCategories(categories.filter(c => c.id !== id));
    setSelectedCategoryIds(selectedCategoryIds.filter(catId => catId !== id));
    setTransactions(transactions.map(t => t.categoryId === id ? { ...t, categoryId: undefined, categoryName: undefined, categoryColor: undefined } : t));
  };

  const handleUpdateTransactionCategory = async (transactionId: number, categoryId: number | null) => {
    const updatedTransaction = await apiService.updateTransactionCategory(transactionId, categoryId);
    setTransactions(transactions.map(t => t.id === transactionId ? updatedTransaction : t));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (t.categoryId != null) {
        return selectedCategoryIds.includes(t.categoryId);
      }
      return true; // Se não tem categoria, mostra sempre
    });
  }, [transactions, selectedCategoryIds]);

  const summary = useMemo<DashboardSummary>(() => {
    let totalIncomes = 0;
    let totalExpenses = 0;

    filteredTransactions.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      if (cat && !cat.includeInDashboard) return;

      if (t.amount > 0) {
        totalIncomes += t.amount;
      } else {
        totalExpenses += Math.abs(t.amount);
      }
    });

    return {
      totalIncomes,
      totalExpenses,
      balance: totalIncomes - totalExpenses
    };
  }, [filteredTransactions, categories]);

  return (
    <>
      <PeriodFilter 
        startDate={startDate} 
        endDate={endDate} 
        onStartDateChange={setStartDate} 
        onEndDateChange={setEndDate} 
      />

      {error && (
        <div className="card" style={{ gridColumn: 'span 12', color: '#ff4d4d', borderColor: '#ff4d4d' }}>
          {error}
        </div>
      )}
      
      <DashboardFilters 
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        onChange={setSelectedCategoryIds}
        onManageCategories={() => setIsCategoryModalOpen(true)}
      />

      <Summary summary={summary} />
      
      <AccountList accounts={accounts} onSync={handleSync} />

      <TransactionList 
        transactions={filteredTransactions} 
        categories={categories}
        onUpdateCategory={handleUpdateTransactionCategory}
      />
      
      <CategoryManagerModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />
    </>
  );
}
