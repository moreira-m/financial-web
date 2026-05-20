"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../services/apiServices";
import { Transaction } from "../../types";

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
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Histórico de Transações</h1>

      <section style={{ marginBottom: "20px" }}>
        <label>
          Início: 
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>
        <label>
          Fim: 
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            style={{ marginLeft: "10px" }}
          />
        </label>
      </section>

      {loading && <p>Carregando transações...</p>}
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p>Nenhuma transação encontrada no período.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Data</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Descrição</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Conta</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px" }}>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{tx.date}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{tx.description}</td>
                <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{tx.accountName}</td>
                <td style={{ 
                  borderBottom: "1px solid #eee", 
                  padding: "8px", 
                  color: tx.amount < 0 ? "red" : "green",
                  fontWeight: "bold"
                }}>
                  {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}