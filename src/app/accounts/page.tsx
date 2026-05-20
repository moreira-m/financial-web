"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../services/apiServices";
import { Account } from "../../types";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await apiService.getAccounts();
        setAccounts(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar as contas.");
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  async function handleSync(pluggyAccountId: string) {
    try {
      setSyncingId(pluggyAccountId);
      await apiService.syncAccount(pluggyAccountId);
      alert("Sincronização concluída com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao sincronizar a conta.");
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Contas Bancárias</h1>

      {loading && <p>Carregando contas...</p>}
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && accounts.length === 0 && (
        <p>Nenhuma conta encontrada.</p>
      )}

      {!loading && !error && accounts.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {accounts.map((account) => (
            <li 
              key={account.id} 
              style={{ 
                border: "1px solid #ccc", 
                padding: "10px", 
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong>{account.name}</strong> - {account.type}
              </div>
              <button 
                onClick={() => handleSync(account.pluggyAccountId)}
                disabled={syncingId === account.pluggyAccountId}
                style={{ padding: "8px 16px", cursor: "pointer" }}
              >
                {syncingId === account.pluggyAccountId ? "Sincronizando..." : "Sincronizar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}