import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Monitor, Projector, Lightbulb, Snowflake, Plug, ArrowLeft, LayoutGrid, ChevronRight} from "lucide-react";
import { BackgroundBlobs } from "../components/background";
import { useTheme } from "../components/theme/theme-context";
import { Header } from "../components/header"; 
import { DeviceCard } from "../components/home/device-list";
import { useDeviceManagement } from "../components/hooks/use-device-management"; 
import { DashModal } from "../components/home/modal";

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

function RoomCard({ room, onClick, darkMode }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl text-left w-full ${
        darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <LayoutGrid className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {room.name}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {room.devices} dispositivo{room.devices !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{room.online} online</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{room.offline} offline</span>
        </span>
      </div>
    </button>
  );
}

function DeviceTypeSection({icon: Icon, label, devices, onToggleAll, onExpand, darkMode, isExpanded, deviceIcons, toggleDevice, updateStatus, deleteDevice, formatDate }: any) {
  const controllableDevices = devices.filter((d: Device) => d.status !== "manutencao");
  const activeControllableCount = controllableDevices.filter((d: Device) => d.ativo).length;
  const allOn = controllableDevices.length > 0 && activeControllableCount === controllableDevices.length;
  const someOn = activeControllableCount > 0 && activeControllableCount < controllableDevices.length;
  const noneOn = activeControllableCount === 0;
  
  const handleToggleAll = () => {
    const shouldTurnOn = activeControllableCount <= controllableDevices.length / 2;
    
    controllableDevices.forEach((device: Device) => {
      if (device.ativo !== shouldTurnOn) {
        toggleDevice(device.id);
      }
    });
  };
  
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-6 ${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Icon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {label}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {devices.length} dispositivo{devices.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleAll();
              }}
              disabled={controllableDevices.length === 0}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                controllableDevices.length === 0 
                  ? 'opacity-50 cursor-not-allowed bg-gray-400'
                  : allOn 
                    ? 'bg-green-500' 
                    : someOn 
                      ? 'bg-yellow-500' 
                      : darkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  allOn ? 'translate-x-7' : noneOn ? 'translate-x-1' : 'translate-x-4'
                }`}
              />
            </button>
            
            <button
              onClick={onExpand}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''} ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 grid grid-cols-1 gap-4">
          {devices.map((device: Device) => (
            <div key={device.id} className={`border-t pt-4 first:border-t-0 first:pt-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <DeviceCard
                device={device}
                deviceIcons={deviceIcons}
                statusColors={{
                  online: darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800",
                  offline: darkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-800",
                  manutencao: darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800",
                }}
                statusLabels={{
                  online: "Online",
                  offline: "Offline",
                  manutencao: "Manutenção",
                }}
                onToggle={toggleDevice}
                onUpdateStatus={updateStatus}
                onDelete={deleteDevice}
                formatDate={formatDate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoomDetails({ sala, devices, onBack, darkMode, deviceIcons, tipoLabels, toggleDevice, updateStatus, deleteDevice, formatDate, toggleAllInCategory }: any) {
  const [expandedTypes, setExpandedTypes] = useState<string[]>([]);
  
  const roomDevices = devices.filter((d: Device) => d.sala === sala);
  
  const stats = {
    total: roomDevices.length,
    online: roomDevices.filter((d: Device) => d.status === "online").length,
    offline: roomDevices.filter((d: Device) => d.status === "offline").length,
    manutencao: roomDevices.filter((d: Device) => d.status === "manutencao").length,
  };

    const tipos = Array.from(new Set(roomDevices.map((d: Device) => d.tipo))) as Device["tipo"][];
    const typeGroups = tipos.map((tipo: Device["tipo"]) => ({
      tipo,
      devices: roomDevices.filter((d: Device) => d.tipo === tipo),
    }));

  const toggleExpanded = (tipo: string) => {
    setExpandedTypes(prev => 
      prev.includes(tipo) 
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
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
        <span>Voltar às Salas</span>
      </button>

      <div className={`rounded-xl shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <LayoutGrid className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {sala}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Dispositivos organizados por tipo
            </p>
          </div>
        </div>
      </div>

      <Statistics stats={stats} darkMode={darkMode} />

      {typeGroups.length > 0 ? (
        <div className="space-y-4">
          {typeGroups.map(group => (
            <DeviceTypeSection
              key={group.tipo}
              tipo={group.tipo}
              icon={deviceIcons[group.tipo as keyof typeof deviceIcons]}
              deviceIcons={deviceIcons}
              label={tipoLabels[group.tipo as keyof typeof tipoLabels]}
              devices={group.devices}
              onToggleAll={() => toggleAllInCategory(group.devices)}
              onExpand={() => toggleExpanded(group.tipo)}
              isExpanded={expandedTypes.includes(group.tipo)}
              darkMode={darkMode}
              toggleDevice={toggleDevice}
              updateStatus={updateStatus}
              deleteDevice={deleteDevice}
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

  const tipoLabels = {
    computador: "Computadores",
    projetor: "Projetores",
    iluminacao: "Iluminação",
    ar_condicionado: "Ar Condicionado",
    outro: "Outros",
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

  const toggleAllInCategory = (categoryDevices: Device[]) => {
    const allOn = categoryDevices.every(d => d.ativo && d.status === "online");
    categoryDevices.forEach(device => {
      if (device.status === "online") {
        if ((allOn && device.ativo) || (!allOn && !device.ativo)) {
          toggleDevice(device.id);
        }
      }
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-linear-to-br from-blue-50 to-indigo-100'
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
          tipoLabels={tipoLabels}
          toggleDevice={toggleDevice}
          updateStatus={updateStatus}
          deleteDevice={deleteDevice}
          formatDate={formatDate}
          toggleAllInCategory={toggleAllInCategory}
        />
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Statistics stats={stats} darkMode={darkMode} />

          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Selecione uma Sala
          </h2>

          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <RoomCard
                  key={room.name}
                  room={room}
                  onClick={() => setSelectedRoom(room.name)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          ) : (
            <div className={`rounded-xl shadow-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Nenhuma sala cadastrada
              </p>
            </div>
          )}
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