import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTheme } from "../components/ThemeContext";
import { DashFilters } from "../components/dashboard/filters";
import { DeviceList } from "../components/dashboard/device-list";
import { DashStatistics } from "../components/dashboard/statistics";
import { DashModal } from "../components/dashboard/modal";
import { BackgroundBlobs } from "../components/background";
import { Header } from "../components/header";

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

export default function Dashboard() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate(); 
  
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

  const handleGoToSettings = () => {
    navigate('/settings'); 
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <BackgroundBlobs darkMode={darkMode} />

      {/* Header */}
      <Header 
        darkMode={darkMode} 
        onGoToSettings={() => navigate('/settings')}
        onLogout={() => handleLogout()}
      />

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