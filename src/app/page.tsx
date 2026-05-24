"use client";

import { useState, useEffect } from "react";
import { apiService } from "../services/apiServices";
import { Account, Transaction, DashboardSummary } from "../types";
import { Summary } from "../components/Summary";
import { AccountList } from "../components/AccountList";
import { TransactionList } from "../components/TransactionList";
import { PeriodFilter } from "../components/PeriodFilter";
import "./dashboard.scss";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
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
        
        const [summaryData, accountsData, transactionsData] = await Promise.all([
          apiService.getDashboardSummary(startDate, endDate),
          apiService.getAccounts(),
          apiService.getTransactions(startDate, endDate)
        ]);

        setSummary(summaryData);
        setAccounts(accountsData);
        setTransactions(transactionsData);
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
      // Re-load data after sync
      const [summaryData, accountsData, transactionsData] = await Promise.all([
        apiService.getDashboardSummary(startDate, endDate),
        apiService.getAccounts(),
        apiService.getTransactions(startDate, endDate)
      ]);
      setSummary(summaryData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error(err);
      setError("Falha na sincronização da conta [ERR_SYNC_FAILED]");
    } finally {
      setLoading(false);
    }
  }

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

      {summary && <Summary summary={summary} />}
      
      <AccountList accounts={accounts} onSync={handleSync} />

      <TransactionList transactions={transactions} />
    </>
  );
}
