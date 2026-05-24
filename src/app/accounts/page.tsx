"use client";

import { useState, useEffect, useCallback } from "react";
import { apiService } from "../../services/apiServices";
import { Account } from "../../types";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  
  const [itemId, setItemId] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      console.log(">>> [FRONT] Solicitando lista de contas ao backend...");
      const data = await apiService.getAccounts();
      console.log(">>> [FRONT] Contas recebidas:", data);
      setAccounts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err: any) {
      console.error(">>> [FRONT] Erro ao carregar contas:", err);
      setError("Falha na conexão com o servidor de dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  async function handleSync(pluggyAccountId: string) {
    try {
      setSyncingId(pluggyAccountId);
      await apiService.syncAccount(pluggyAccountId);
      await loadAccounts(); 
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  }

  async function handleImport() {
    if (!itemId) return;
    
    try {
      setIsImporting(true);
      setError("");
      console.log(">>> [FRONT] Iniciando importação do Item:", itemId);
      await apiService.importAccounts(itemId);
      console.log(">>> [FRONT] Importação enviada com sucesso!");
      setItemId(""); 
      
      setTimeout(() => {
        loadAccounts();
      }, 1500);
      
    } catch (err: any) {
      console.error(">>> [FRONT] Erro na importação:", err);
      setError("Erro ao processar importação. Verifique o console do backend.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <>
      <section className="card" style={{ gridColumn: 'span 12', marginBottom: '1rem' }}>
        <h3>Importar Novas Contas</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            className="blueprint-input"
            placeholder="Cole seu Item ID aqui" 
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button 
            className="blueprint-button"
            onClick={handleImport}
            disabled={isImporting}
          >
            {isImporting ? "[IMPORTANDO...]" : "[IMPORTAR_CONTAS]"}
          </button>
        </div>
      </section>

      {loading && accounts.length === 0 && (
        <div style={{ gridColumn: 'span 12', padding: '1rem' }}>[CARREGANDO_CONTAS_DO_SISTEMA...]</div>
      )}
      
      {error && (
        <div className="card" style={{ gridColumn: 'span 12', color: '#ff4d4d', borderColor: '#ff4d4d' }}>
          {error}
        </div>
      )}

      {!loading && accounts.length === 0 && !error && (
        <div className="card" style={{ gridColumn: 'span 12', textAlign: 'center', opacity: 0.6 }}>
          Nenhuma conta encontrada no banco de dados local. <br/>
          Cole um Item ID válido acima para começar.
        </div>
      )}

      {accounts.length > 0 && (
        <div className="accounts-section" style={{ gridColumn: 'span 12' }}>
          <div className="accounts-grid">
            {accounts.map((account) => (
              <div key={account.id} className="account-card">
                <div className="account-info">
                  <div className="account-name">{account.name}</div>
                  <div className="account-type">{account.type}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '5px' }}>ID: {account.pluggyAccountId}</div>
                </div>
                <button 
                  className="blueprint-button" 
                  onClick={() => handleSync(account.pluggyAccountId)}
                  disabled={syncingId === account.pluggyAccountId}
                  style={{ fontSize: '0.6rem', padding: '4px 8px', marginTop: '10px' }}
                >
                  {syncingId === account.pluggyAccountId ? "[SYNCING...]" : "[SYNC_DATA]"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
