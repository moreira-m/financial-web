import { useState, useRef, useEffect } from "react";
import { Category } from "../types";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number | null | undefined;
  onChange: (categoryId: number | null) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onChange }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%", minWidth: "150px" }}>
      <div 
        style={{ 
          backgroundColor: selectedCategory ? selectedCategory.color + '20' : 'rgba(0,0,0,0.2)',
          color: selectedCategory ? selectedCategory.color : '#ffffff',
          border: `1px solid ${selectedCategory ? selectedCategory.color : 'rgba(255,255,255,0.4)'}`,
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
          height: '32px'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedCategory && (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedCategory.color }}></span>
          )}
          {selectedCategory ? selectedCategory.name : "Selecionar..."}
        </span>
        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "#3C57B2", // blueprint bg
          border: "1px solid rgba(255,255,255,0.4)",
          borderTop: "none",
          zIndex: 50,
          maxHeight: "200px",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }}>
          <div 
            style={{ padding: '0.5rem 0.8rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => { onChange(null); setIsOpen(false); }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Nenhuma Categoria
          </div>
          {categories.map(category => (
            <div 
              key={category.id} 
              style={{ padding: '0.5rem 0.8rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => { onChange(category.id); setIsOpen(false); }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: category.color }}></span>
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
