"use client";

import { useState, useEffect } from "react";
import { apiService } from "../services/apiServices";
import { DashboardSummary } from "../types";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
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

    async function loadSummary() {
      try {
        setLoading(true);
        setError("");
        const data = await apiService.getDashboardSummary(startDate, endDate);
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o resumo do período.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [startDate, endDate]);

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Painel de Controle</h1>

      <section style={{ marginBottom: "20px" }}>
        <h3>Filtro de Período</h3>
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

      {loading && <p>Carregando resumo...</p>}
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && summary && (
        <section>
          <h2>Resumo Financeiro</h2>
          <ul>
            <li><strong>Receitas:</strong> R$ {summary.totalIncomes.toFixed(2)}</li>
            <li><strong>Despesas:</strong> R$ {summary.totalExpenses.toFixed(2)}</li>
            <li><strong>Saldo:</strong> R$ {summary.balance.toFixed(2)}</li>
          </ul>
        </section>
      )}
    </main>
  );
}