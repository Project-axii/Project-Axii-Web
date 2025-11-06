import { useTheme } from "../ThemeContext";
import { DashInput } from "./input";

interface NewDevice {
  nome: string;
  ip: string;
  tipo: string;
  sala: string;
  descricao: string;
}

interface DashModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  newDevice: NewDevice;
  setNewDevice: (device: NewDevice) => void;
  handleAddDevice: () => void;
}

export function DashModal({
  showModal,
  setShowModal,
  newDevice,
  setNewDevice,
  handleAddDevice,
}: DashModalProps) {
  const { darkMode } = useTheme();

  const formFields = [
    {
      key: "nome", label: "Nome do Dispositivo *", type: "text", placeholder: "Ex: PC-01-LAB",
    },
    {
      key: "ip", label: "Endereço IP *", type: "text", placeholder: "Ex: 192.168.1.100",
    },
    {
      key: "sala", label: "Sala", type: "text", placeholder: "Ex: Laboratório 1",
    },
  ];

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Adicionar Novo Dispositivo
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className={`transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {formFields.map((field) => (
            <div key={field.key}>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {field.label}
              </label>
              <DashInput
                type={field.type}
                value={newDevice[field.key as keyof NewDevice]}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Tipo *
            </label>
            <select
              value={newDevice.tipo}
              onChange={(e) =>
                setNewDevice({ ...newDevice, tipo: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
            >
              <option value="">Selecione...</option>
              <option value="computador">Computador</option>
              <option value="projetor">Projetor</option>
              <option value="iluminacao">Iluminação</option>
              <option value="ar_condicionado">Ar Condicionado</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Descrição
            </label>
            <textarea
              value={newDevice.descricao}
              onChange={(e) =>
                setNewDevice({ ...newDevice, descricao: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 resize-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
              placeholder="Informações adicionais sobre o dispositivo..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleAddDevice}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02] ${
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}