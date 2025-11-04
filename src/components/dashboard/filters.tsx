import { DashSelect } from "./select";
import { useTheme } from "../ThemeContext";

interface DashFiltersProps {
  filtroTipo: string;
  setFiltroTipo: (value: string) => void;
  filtroSala: string;
  setFiltroSala: (value: string) => void;
  filtroStatus: string;
  setFiltroStatus: (value: string) => void;
  salas: string[];
  setShowModal: (value: boolean) => void;
}

export function DashFilters({
  filtroTipo,
  setFiltroTipo,
  filtroSala,
  setFiltroSala,
  filtroStatus,
  setFiltroStatus,
  salas,
  setShowModal
}: DashFiltersProps) {
  const { darkMode } = useTheme(); // ← Pegue darkMode do contexto

  return (
    <div
      className={`rounded-xl shadow-lg p-4 md:p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Tipo
          </label>
          <DashSelect
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            
          >
            <option value="">Todos</option>
            <option value="computador">Computador</option>
            <option value="projetor">Projetor</option>
            <option value="iluminacao">Iluminação</option>
            <option value="ar_condicionado">Ar Condicionado</option>
            <option value="outro">Outro</option>
          </DashSelect>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Sala
          </label>
          <DashSelect
            value={filtroSala}
            onChange={(e) => setFiltroSala(e.target.value)}
            
          >
            <option value="">Todas</option>
            {salas.map((sala) => (
              <option key={sala} value={sala}>
                {sala}
              </option>
            ))}
          </DashSelect>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Status
          </label>
          <DashSelect
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            
          >
            <option value="">Todos</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="manutencao">Manutenção</option>
          </DashSelect>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            &nbsp;
          </label>
          <button
            onClick={() => {
              setFiltroTipo("");
              setFiltroSala("");
              setFiltroStatus("");
            }}
            className={`w-full px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Limpar
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02] ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Adicionar Dispositivo</span>
      </button>
    </div>
  );
}