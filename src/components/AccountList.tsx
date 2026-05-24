import { Account } from "../types";

interface AccountListProps {
  accounts: Account[];
  onSync: (id: string) => void;
}

export function AccountList({ accounts, onSync }: AccountListProps) {
  return (
    <div className="accounts-section">
      <h3>Contas Ativas</h3>
      <div className="accounts-grid">
        {accounts.map((account) => (
          <div key={account.id} className="account-card">
            <div className="account-info">
              <div className="account-name">{account.name}</div>
              <div className="account-type">{account.type}</div>
            </div>
            <button 
              className="blueprint-button" 
              onClick={() => onSync(account.pluggyAccountId)}
              style={{ fontSize: '0.6rem', padding: '4px 8px', marginTop: '10px' }}
            >
              [SYNC_DATA]
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
