import { Transaction, Category } from "../types";
import { CategorySelector } from "./CategorySelector";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onUpdateCategory: (transactionId: number, categoryId: number | null) => Promise<void>;
}

export function TransactionList({ transactions, categories, onUpdateCategory }: TransactionListProps) {
  return (
    <div className="transactions-section">
      <h3>Fluxo de Transações</h3>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Conta</th>
            <th>Categoria</th>
            <th style={{ textAlign: 'right' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.description}</td>
              <td>{t.accountName}</td>
              <td>
                <CategorySelector 
                  categories={categories}
                  selectedCategoryId={t.categoryId}
                  onChange={(categoryId) => onUpdateCategory(t.id, categoryId)}
                />
              </td>
              <td className={`amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                R$ {t.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
