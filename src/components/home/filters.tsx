import { DashSelect } from "./select";
import { useTheme } from "../theme-context";

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
  const { darkMode } = useTheme();

  const filters = [
    {
      label: "Tipo",
      value: filtroTipo,
      onChange: setFiltroTipo,
      options: [
        { value: "", label: "Todos" },
        { value: "computador", label: "Computador" },
        { value: "projetor", label: "Projetor" },
        { value: "iluminacao", label: "Iluminação" },
        { value: "ar_condicionado", label: "Ar Condicionado" },
        { value: "outro", label: "Outro" }
      ]
    },
    {
      label: "Sala",
      value: filtroSala,
      onChange: setFiltroSala,
      options: [
        { value: "", label: "Todas" },
        ...salas.map(sala => ({ value: sala, label: sala }))
      ]
    },
    {
      label: "Status",
      value: filtroStatus,
      onChange: setFiltroStatus,
      options: [
        { value: "", label: "Todos" },
        { value: "online", label: "Online" },
        { value: "offline", label: "Offline" },
        { value: "manutencao", label: "Manutenção" }
      ]
    }
  ];

  const handleClearFilters = () => {
    setFiltroTipo("");
    setFiltroSala("");
    setFiltroStatus("");
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-4 md:p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {filters.map((filter) => (
          <div key={filter.label}>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {filter.label}
            </label>
            <DashSelect
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </DashSelect>
          </div>
        ))}

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            &nbsp;
          </label>
          <button
            onClick={handleClearFilters}
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