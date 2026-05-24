import { DashboardSummary } from "../types";

interface SummaryProps {
  summary: DashboardSummary;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className="summary-section">
      <h3>Resumo do Sistema</h3>
      <div className="summary-item">
        <span className="label">Receitas</span>
        <span className="value income">R$ {summary.totalIncomes.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Despesas</span>
        <span className="value expense">R$ {summary.totalExpenses.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Saldo Líquido</span>
        <span className="value balance">R$ {summary.balance.toFixed(2)}</span>
      </div>
    </div>
  );
}
