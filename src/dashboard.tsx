import { useState} from "react";
import { DashInput } from './components/dashboard/input';
import { useTheme} from "./components/ThemeContext";
import { DashFilters } from "./components/dashboard/filters";

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

export default function DeviceManagement() {
  const { darkMode, toggleDarkMode} = useTheme();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      nome: "PC-01-LAB",
      ip: "192.168.1.100",
      tipo: "computador",
      sala: "Laboratório 1",
      descricao: "Computador principal do laboratório",
      status: "online",
      ativo: true,
      ultima_conexao: new Date().toISOString(),
    },
    {
      id: 2,
      nome: "PROJETOR-SALA-A",
      ip: "192.168.1.101",
      tipo: "projetor",
      sala: "Sala A",
      descricao: "Projetor multimídia",
      status: "offline",
      ativo: true,
      ultima_conexao: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      nome: "AR-COND-02",
      ip: "192.168.1.102",
      tipo: "ar_condicionado",
      sala: "Sala B",
      descricao: "Ar condicionado 18000 BTUs",
      status: "manutencao",
      ativo: false,
      ultima_conexao: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const [newDevice, setNewDevice] = useState({
    nome: "",
    ip: "",
    tipo: "",
    sala: "",
    descricao: "",
  });


  const deviceIcons = {
    computador: "🖥️",
    projetor: "📽️",
    iluminacao: "💡",
    ar_condicionado: "❄️",
    outro: "🔌",
  };

  const statusColors = {
    online: darkMode
      ? "bg-green-900/30 text-green-400"
      : "bg-green-100 text-green-800",
    offline: darkMode
      ? "bg-yellow-900/30 text-yellow-400"
      : "bg-yellow-100 text-yellow-800",
    manutencao: darkMode
      ? "bg-red-900/30 text-red-400"
      : "bg-red-100 text-red-800",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    manutencao: "Manutenção",
  };

  const filteredDevices = devices.filter((device) => {
    if (filtroTipo && device.tipo !== filtroTipo) return false;
    if (filtroSala && device.sala !== filtroSala) return false;
    if (filtroStatus && device.status !== filtroStatus) return false;
    return true;
  });

  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.status === "online").length,
    offline: devices.filter((d) => d.status === "offline").length,
    manutencao: devices.filter((d) => d.status === "manutencao").length,
  };

  const salas = [...new Set(devices.map((d) => d.sala).filter(Boolean))];

  const handleAddDevice = () => {
    if (!newDevice.nome || !newDevice.ip || !newDevice.tipo) {
      alert("Por favor, preencha os campos obrigatórios");
      return;
    }

    const device: Device = {
      id: devices.length + 1,
      nome: newDevice.nome,
      ip: newDevice.ip,
      tipo: newDevice.tipo as Device["tipo"],
      sala: newDevice.sala,
      descricao: newDevice.descricao,
      status: "offline",
      ativo: true,
      ultima_conexao: new Date().toISOString(),
    };
    setDevices([...devices, device]);
    setNewDevice({ nome: "", ip: "", tipo: "", sala: "", descricao: "" });
    setShowModal(false);
  };

  const toggleDevice = (id: number) => {
    setDevices(
      devices.map((d) => (d.id === id ? { ...d, ativo: !d.ativo } : d))
    );
  };

  const updateStatus = (id: number, status: Device["status"]) => {
    setDevices(devices.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const deleteDevice = (id: number) => {
    if (window.confirm("Deseja realmente excluir este dispositivo?")) {
      setDevices(devices.filter((d) => d.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
            darkMode ? "bg-blue-500" : "bg-blue-400"
          }`}
          style={{ top: "-10%", left: "-10%", animationDelay: "0s" }}
        ></div>
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
            darkMode ? "bg-purple-500" : "bg-purple-400"
          }`}
          style={{ bottom: "-10%", right: "-10%", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`relative z-10 ${
          darkMode ? "bg-gray-800/80" : "bg-white/80"
        } backdrop-blur-sm shadow-md`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  darkMode
                    ? "bg-blue-600"
                    : "bg-gradient-to-br from-blue-500 to-indigo-600"
                }`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                AXII
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400"
                    : "bg-gray-100 text-gray-700"
                }`}
                aria-label="Alternar tema"
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  darkMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                } shadow-lg transform hover:scale-[1.02]`}
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
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

        <DashFilters
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
          filtroSala={filtroSala}
          setFiltroSala={setFiltroSala}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          salas={salas}
          setShowModal={setShowModal}
        />

        {/* Lista de Dispositivos */}
        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <div
                key={device.id}
                className={`rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{deviceIcons[device.tipo]}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[device.status]
                      }`}
                    >
                      {statusLabels[device.status]}
                    </span>
                  </div>

                  <h3
                    className={`text-xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {device.nome}
                  </h3>

                  <div
                    className={`space-y-2 text-sm mb-4 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <p className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      <span className="break-all">{device.ip}</span>
                    </p>
                    {device.sala && (
                      <p className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        {device.sala}
                      </p>
                    )}
                    {device.descricao && (
                      <p className="flex items-start">
                        <svg
                          className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="break-words">{device.descricao}</span>
                      </p>
                    )}
                    <p className="flex items-center text-xs">
                      <svg
                        className="w-4 h-4 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(device.ultima_conexao)}
                    </p>
                  </div>

                  <div
                    className={`flex items-center justify-between pt-4 border-t ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={device.ativo}
                          onChange={() => toggleDevice(device.id)}
                          className="sr-only"
                        />
                        <div
                          className={`block w-14 h-8 rounded-full transition ${
                            device.ativo
                              ? "bg-blue-600"
                              : darkMode
                              ? "bg-gray-600"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                            device.ativo ? "transform translate-x-6" : ""
                          }`}
                        ></div>
                      </div>
                    </label>

                    <select
                      value={device.status}
                      onChange={(e) =>
                        updateStatus(
                          device.id,
                          e.target.value as Device["status"]
                        )
                      }
                      className={`px-3 py-1 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                      }`}
                    >
                      <option value="online">🟢 Online</option>
                      <option value="offline">🟡 Offline</option>
                      <option value="manutencao">🔴 Manutenção</option>
                    </select>

                    <button
                      onClick={() => deleteDevice(device.id)}
                      className={`p-2 rounded-lg transition ${
                        darkMode
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-red-500 hover:bg-red-50"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-lg p-12 text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <svg
              className={`w-24 h-24 mx-auto mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-300"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Nenhum dispositivo encontrado
            </h3>
            <p className={darkMode ? "text-gray-500" : "text-gray-500"}>
              Adicione seu primeiro dispositivo para começar
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
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
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nome do Dispositivo *
                </label>
                <DashInput
                  type="text"
                  value={newDevice.nome}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, nome: e.target.value })
                    
                  }
                  placeholder="Ex: PC-01-LAB"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Endereço IP *
                </label>
                <DashInput
                  type="text"
                  value={newDevice.ip}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, ip: e.target.value })
                  }
                  placeholder="Ex: 192.168.1.100"
                />
              </div>

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
                  Sala
                </label>
                <DashInput
                  type="text"
                  value={newDevice.sala}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, sala: e.target.value })
                  }
                  placeholder="Ex: Laboratório 1"
                />
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
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
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
      )}

      <style>{`
        @keyframes float {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -30px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
        }
        .animate-float {
        animation: float 20s ease-in-out infinite;
        }
    `}</style>
    </div>
  );
}
