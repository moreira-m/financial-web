import { useState } from "react";
import { Category } from "../types";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreate: (category: Omit<Category, "id">) => Promise<void>;
  onUpdate: (id: number, category: Omit<Category, "id">) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManagerModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [includeInDashboard, setIncludeInDashboard] = useState(true);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) return;

    if (editingId) {
      await onUpdate(editingId, { name, color, includeInDashboard });
    } else {
      await onCreate({ name, color, includeInDashboard });
    }
    
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setColor(category.color);
    setIncludeInDashboard(category.includeInDashboard);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setColor("#ffffff");
    setIncludeInDashboard(true);
  };

  return (
    <div style={modalOverlayStyle}>
      <div className="card" style={modalContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2>Gerenciar Categorias</h2>
          <button className="blueprint-button" onClick={onClose}>X</button>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "flex-end" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase" }}>
              Nome da Categoria
            </label>
            <input
              type="text"
              className="blueprint-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Mercado"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase" }}>Cor</label>
            <input
              type="color"
              className="blueprint-input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ padding: "0.2rem", height: "38px", width: "50px", cursor: "pointer" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "38px" }}>
            <input
              type="checkbox"
              id="includeInDashboard"
              checked={includeInDashboard}
              onChange={(e) => setIncludeInDashboard(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="includeInDashboard" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", cursor: "pointer" }}>
              Soma no Dashboard?
            </label>
          </div>
          <button className="blueprint-button" onClick={handleSave}>
            {editingId ? "Atualizar" : "Criar"}
          </button>
          {editingId && (
            <button className="blueprint-button" onClick={resetForm} style={{ borderColor: "#666", color: "#666" }}>
              Cancelar
            </button>
          )}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.8rem", borderBottom: "2px solid #fff" }}>Nome</th>
              <th style={{ textAlign: "left", padding: "0.8rem", borderBottom: "2px solid #fff" }}>Cor</th>
              <th style={{ textAlign: "left", padding: "0.8rem", borderBottom: "2px solid #fff" }}>Dashboard?</th>
              <th style={{ textAlign: "right", padding: "0.8rem", borderBottom: "2px solid #fff" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
                <td style={{ padding: "0.8rem" }}>{c.name}</td>
                <td style={{ padding: "0.8rem" }}>
                  <div style={{ width: "20px", height: "20px", backgroundColor: c.color, border: "1px solid #fff" }}></div>
                </td>
                <td style={{ padding: "0.8rem" }}>{c.includeInDashboard ? "Sim" : "Não"}</td>
                <td style={{ padding: "0.8rem", textAlign: "right" }}>
                  <button className="blueprint-button" style={{ marginRight: "0.5rem", padding: "0.3rem 0.6rem", fontSize: "0.7rem" }} onClick={() => handleEdit(c)}>
                    Editar
                  </button>
                  <button className="blueprint-button" style={{ borderColor: "#ff4d4d", color: "#ff4d4d", padding: "0.3rem 0.6rem", fontSize: "0.7rem" }} onClick={() => onDelete(c.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "1rem", textAlign: "center", opacity: 0.6 }}>
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(4px)",
};

const modalContentStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: "#3C57B2", // blueprint bg
};
