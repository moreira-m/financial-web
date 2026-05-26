import { DashboardSummary } from "../types";
import { usePrivacy } from "@/contexts/PrivacyContext";

interface SummaryProps {
  summary: DashboardSummary;
}

export function Summary({ summary }: SummaryProps) {
  const { formatValue } = usePrivacy();

  return (
    <div className="summary-section">
      <h3>Resumo do Sistema</h3>
      <div className="summary-item">
        <span className="label">Receitas</span>
        <span className="value income">{formatValue(summary.totalIncomes)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Despesas</span>
        <span className="value expense">{formatValue(summary.totalExpenses)}</span>
      </div>
      <div className="summary-item">
        <span className="label">Saldo Líquido</span>
        <span className="value balance">{formatValue(summary.balance)}</span>
      </div>
    </div>
  );
}
