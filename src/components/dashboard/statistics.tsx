import { useTheme } from "../theme-context";

interface Stats {
  total: number;
  online: number;
  offline: number;
  manutencao: number;
}

interface DashStatisticsProps {
  stats: Stats;
}

export function DashStatistics({ stats }: DashStatisticsProps) {
  const { darkMode } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div
        className={`rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:scale-105 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h3
          className={`text-xs md:text-sm font-medium mb-2 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Total de Dispositivos
        </h3>
        <div
          className={`text-2xl md:text-3xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {stats.total}
        </div>
      </div>

      <div
        className={`rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:scale-105 ${
          darkMode ? "bg-green-900/20" : "bg-green-50"
        }`}
      >
        <h3
          className={`text-xs md:text-sm font-medium mb-2 ${
            darkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          Online
        </h3>
        <div
          className={`text-2xl md:text-3xl font-bold ${
            darkMode ? "text-green-400" : "text-green-700"
          }`}
        >
          {stats.online}
        </div>
      </div>

      <div
        className={`rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:scale-105 ${
          darkMode ? "bg-yellow-900/20" : "bg-yellow-50"
        }`}
      >
        <h3
          className={`text-xs md:text-sm font-medium mb-2 ${
            darkMode ? "text-yellow-400" : "text-yellow-600"
          }`}
        >
          Offline
        </h3>
        <div
          className={`text-2xl md:text-3xl font-bold ${
            darkMode ? "text-yellow-400" : "text-yellow-700"
          }`}
        >
          {stats.offline}
        </div>
      </div>

      <div
        className={`rounded-xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:scale-105 ${
          darkMode ? "bg-red-900/20" : "bg-red-50"
        }`}
      >
        <h3
          className={`text-xs md:text-sm font-medium mb-2 ${
            darkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          Manutenção
        </h3>
        <div
          className={`text-2xl md:text-3xl font-bold ${
            darkMode ? "text-red-400" : "text-red-700"
          }`}
        >
          {stats.manutencao}
        </div>
      </div>
    </div>
  );
}