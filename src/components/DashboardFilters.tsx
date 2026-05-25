import { Category } from "../types";

interface DashboardFiltersProps {
  categories: Category[];
  selectedCategoryIds: number[];
  onChange: (selectedIds: number[]) => void;
  onManageCategories: () => void;
}

export function DashboardFilters({ categories, selectedCategoryIds, onChange, onManageCategories }: DashboardFiltersProps) {
  const toggleCategory = (id: number) => {
    if (selectedCategoryIds.includes(id)) {
      onChange(selectedCategoryIds.filter(catId => catId !== id));
    } else {
      onChange([...selectedCategoryIds, id]);
    }
  };

  const selectAll = () => {
    onChange(categories.map(c => c.id));
  };

  const deselectAll = () => {
    onChange([]);
  };

  return (
    <div className="filter-section" style={{ gridColumn: "span 12", flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Filtros de Categoria</h3>
        <button className="blueprint-button" onClick={onManageCategories}>
          Gerenciar Categorias
        </button>
      </div>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);
          return (
            <button
              key={category.id}
              className="blueprint-button"
              onClick={() => toggleCategory(category.id)}
              style={{
                borderColor: category.color,
                color: isSelected ? "#fff" : category.color,
                backgroundColor: isSelected ? category.color : "transparent",
                opacity: isSelected ? 1 : 0.7,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                backgroundColor: isSelected ? "#fff" : category.color,
                display: "inline-block" 
              }}></span>
              {category.name}
            </button>
          );
        })}
        {categories.length === 0 && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", opacity: 0.6 }}>
            Nenhuma categoria disponível. Crie uma para começar a filtrar.
          </span>
        )}
      </div>

      {categories.length > 0 && (
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="blueprint-button" style={{ fontSize: "0.6rem", padding: "0.2rem 0.5rem", border: "none", textDecoration: "underline" }} onClick={selectAll}>
            Selecionar Todas
          </button>
          <button className="blueprint-button" style={{ fontSize: "0.6rem", padding: "0.2rem 0.5rem", border: "none", textDecoration: "underline" }} onClick={deselectAll}>
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
