import { useState} from "react";
import { useTheme} from "./components/ThemeContext";
import { DashFilters } from "./components/dashboard/filters";
import { DeviceList } from "./components/dashboard/device-list";
import { DashStatistics } from './components/dashboard/statistics';
import { DashModal } from './components/dashboard/modal';

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
    computador: "",
    projetor: "",
    iluminacao: "",
    ar_condicionado: "",
    outro: "",
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
          : "bg-linear-to-br from-blue-50 to-indigo-100"
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
                    : "bg-linear-to-br from-blue-500 to-indigo-600"
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
                    : "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
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
        <DashStatistics stats={stats} />

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

        <DeviceList
          filteredDevices={filteredDevices}
          deviceIcons={deviceIcons}
          statusColors={statusColors}
          statusLabels={statusLabels}
          toggleDevice={toggleDevice}
          updateStatus={updateStatus}
          deleteDevice={deleteDevice}
          formatDate={formatDate}
        />
        
      </div>

      <DashModal
        showModal={showModal}
        setShowModal={setShowModal}
        newDevice={newDevice}
        setNewDevice={setNewDevice}
        handleAddDevice={handleAddDevice}
      />
      
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
