import { useTheme } from '../theme/theme-context';
import type { LucideIcon } from "lucide-react";

interface Device {
  id: number;
  nome: string;
  ip: string;
  tipo: "computador" | "projetor" | "iluminacao" | "ar_condicionado" | "outro";
  sala: string;
  descricao: string;
  status: "online" | "offline" | "manutencao";
  ativo: boolean;
  ultima_conexao: string;
}

interface DeviceCardProps {
  device: Device;
  deviceIcons: Record<Device["tipo"], LucideIcon>;
  statusColors: Record<Device["status"], string>;
  statusLabels: Record<Device["status"], string>;
  onToggle: (id: number) => void;
  onUpdateStatus: (id: number, status: Device["status"]) => void;
  onDelete: (id: number) => void;
  formatDate: (dateString: string) => string;
}

export function DeviceCard({
  device,
  deviceIcons,
  statusColors,
  statusLabels,
  onToggle,
  onUpdateStatus,
  onDelete,
  formatDate
}: DeviceCardProps) {
  const { darkMode } = useTheme();
  const Icon = deviceIcons[device.tipo];

  return (
    <div className={`rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <Icon />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[device.status]}`}>
            {statusLabels[device.status]}
          </span>
        </div>

        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {device.nome}
        </h3>

        <div className={`space-y-2 text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="break-all">{device.ip}</span>
          </p>

          {device.descricao && (
            <p className="flex items-start">
              <svg className="w-4 h-4 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{device.descricao}</span>
            </p>
          )}

          <p className="flex items-center text-xs">
            <svg className="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(device.ultima_conexao)}
          </p>
        </div>

        <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={device.ativo} onChange={() => onToggle(device.id)} className="sr-only" />
              <div className={`block w-14 h-8 rounded-full transition ${
                device.ativo ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                device.ativo ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
          </label>

          <select
            value={device.status}
            onChange={(e) => onUpdateStatus(device.id, e.target.value as Device["status"])}
            className={`px-3 py-1 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
            }`}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="manutencao">Manutenção</option>
          </select>

          <button
            onClick={() => onDelete(device.id)}
            className={`p-2 rounded-lg transition ${
              darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}