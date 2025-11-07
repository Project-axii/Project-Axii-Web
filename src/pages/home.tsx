import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Monitor, Projector, Lightbulb, Snowflake, Plug, ArrowLeft,} from "lucide-react";
import { BackgroundBlobs } from "../components/background";
import { useTheme } from "../components/theme/theme-context";
import { Header } from "../components/header"; 
import { DeviceCard } from "../components/home/device-list";
import { useDeviceManagement } from "../components/hooks/use-device-management"; 
import { DashModal } from "../components/home/modal";
import { RoomCard } from "../components/home/room-card";

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

function Statistics({ stats, darkMode }: any) {
  const statItems = [
    { label: "Total", value: stats.total, color: darkMode ? "text-blue-400" : "text-blue-600" },
    { label: "Online", value: stats.online, color: "text-green-600" },
    { label: "Offline", value: stats.offline, color: "text-yellow-600" },
    { label: "Manutenção", value: stats.manutencao, color: "text-red-600" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat) => (
        <div key={stat.label} className={`rounded-xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`text-sm font-medium mb-2 ${stat.color}`}>
            {stat.label}
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function RoomDetails({ sala, devices, onBack, darkMode, deviceIcons, statusColors, statusLabels, onToggleDevice, onUpdateStatus, onDeleteDevice, formatDate }: any) {
  const roomDevices = devices.filter((d: Device) => d.sala === sala);
  
  const stats = {
    total: roomDevices.length,
    online: roomDevices.filter((d: Device) => d.status === "online").length,
    offline: roomDevices.filter((d: Device) => d.status === "offline").length,
    manutencao: roomDevices.filter((d: Device) => d.status === "manutencao").length,
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg ${
          darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar ao Dashboard</span>
      </button>

      <div className={`rounded-xl shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {sala}
        </h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerenciamento de dispositivos da sala
        </p>
      </div>

      <Statistics stats={stats} darkMode={darkMode} />

      {roomDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomDevices.map((device: Device) => (
            <DeviceCard
              key={device.id}
              device={device}
              deviceIcons={deviceIcons}
              statusColors={statusColors}
              statusLabels={statusLabels}
              onToggle={onToggleDevice}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDeleteDevice}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <svg className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Nenhum dispositivo encontrado
          </h3>
          <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
            Esta sala não possui dispositivos cadastrados
          </p>
        </div>
      )}
    </div>
  );
}

export default function IntegratedDashboard() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const {
    devices,
    newDevice,
    setNewDevice,
    showModal,
    setShowModal,
    handleAddDevice,
    toggleDevice,
    updateStatus,
    deleteDevice,
  } = useDeviceManagement();

  const deviceIcons = {
    computador: Monitor,
    projetor: Projector,
    iluminacao: Lightbulb,
    ar_condicionado: Snowflake,
    outro: Plug,
  };

  const statusColors = {
    online: darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800",
    offline: darkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-800",
    manutencao: darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800",
  };

  const statusLabels = {
    online: "Online",
    offline: "Offline",
    manutencao: "Manutenção",
  };

  const salas = [...new Set(devices.map(d => d.sala).filter(Boolean))];
  const rooms = salas.map(sala => {
    const salaDevices = devices.filter(d => d.sala === sala);
    return {
      name: sala,
      devices: salaDevices.length,
      online: salaDevices.filter(d => d.status === "online").length,
      offline: salaDevices.filter(d => d.status === "offline").length,
    };
  });

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === "online").length,
    offline: devices.filter(d => d.status === "offline").length,
    manutencao: devices.filter(d => d.status === "manutencao").length,
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
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <BackgroundBlobs darkMode={darkMode} />
      
      <Header 
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        onGoToSettings={() => navigate('/settings')}
        setShowModal={setShowModal}
      />

      {selectedRoom ? (
        <RoomDetails
          sala={selectedRoom}
          devices={devices}
          onBack={() => setSelectedRoom(null)}
          darkMode={darkMode}
          deviceIcons={deviceIcons}
          statusColors={statusColors}
          statusLabels={statusLabels}
          onToggleDevice={toggleDevice}
          onUpdateStatus={updateStatus}
          onDeleteDevice={deleteDevice}
          formatDate={formatDate}
        />
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Statistics stats={stats} darkMode={darkMode} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <RoomCard
                key={room.name}
                room={room}
                onClick={() => setSelectedRoom(room.name)}
              />
            ))}
          </div>
        </div>
      )}

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