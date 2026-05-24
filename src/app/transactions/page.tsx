"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../services/apiServices";
import { Transaction } from "../../types";
import { PeriodFilter } from "../../components/PeriodFilter";

export default function TransactionsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

    async function loadTransactions() {
      try {
        setLoading(true);
        setError("");
        const data = await apiService.getTransactions(startDate, endDate);
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar as transações.");
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [startDate, endDate]);

  return (
    <>
      <PeriodFilter 
        startDate={startDate} 
        endDate={endDate} 
        onStartDateChange={setStartDate} 
        onEndDateChange={setEndDate} 
      />

      {loading && <div style={{ gridColumn: 'span 12' }}>[CARREGANDO_TRANSACOES...]</div>}
      
      {error && <div className="card" style={{ gridColumn: 'span 12', color: '#ff4d4d' }}>{error}</div>}

      {!loading && !error && transactions.length === 0 && (
        <div style={{ gridColumn: 'span 12' }}>Nenhuma transação encontrada no período.</div>
      )}

      <div className="transactions-section" style={{ gridColumn: 'span 12' }}>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Conta</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.description}</td>
                <td>{t.accountName}</td>
                <td className={`amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                  R$ {t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
