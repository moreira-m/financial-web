"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../services/apiServices"; // Verifique se o nome do arquivo é apiService ou apiServices
import { Account } from "../../types";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  
  const [itemId, setItemId] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAccounts();
      setAccounts(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar as contas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  async function handleImport() {
    if (!itemId) {
      alert("Por favor, insira o Item ID da Pluggy.");
      return;
    }
    
    try {
      setIsImporting(true);
      await apiService.importAccounts(itemId);
      alert("Contas importadas com sucesso!");
      setItemId(""); 
      loadAccounts();
    } catch (err) {
      console.error(err);
      alert("Erro ao importar as contas.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Contas Bancárias</h1>

      <section style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Importar Novas Contas da Pluggy</h3>
        <input 
          type="text" 
          placeholder="Cole seu Item ID aqui" 
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button 
          onClick={handleImport}
          disabled={isImporting}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          {isImporting ? "Importando..." : "Importar Contas"}
        </button>
      </section>

      {loading && <p>Carregando contas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && accounts.length === 0 && (
        <p>Nenhuma conta encontrada no banco de dados local.</p>
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
                alignItems: "center",
                borderRadius: "4px"
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