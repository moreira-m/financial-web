interface PeriodFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function PeriodFilter({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: PeriodFilterProps) {
  return (
    <div className="filter-section">
      <div className="filter-group">
        <label>Data Inicial [START_DATE]</label>
        <input 
          type="date" 
          className="blueprint-input"
          value={startDate} 
          onChange={(e) => onStartDateChange(e.target.value)} 
        />
      </div>
      <div className="filter-group">
        <label>Data Final [END_DATE]</label>
        <input 
          type="date" 
          className="blueprint-input"
          value={endDate} 
          onChange={(e) => onEndDateChange(e.target.value)} 
        />
      </div>
    </div>
  );
}
