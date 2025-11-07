import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTheme } from "../components/theme/theme-context";
import { Tab } from "../components/settings/tab";
import { BackgroundBlobs } from "../components/background";
import { Header } from "../components/header";
import { ProfileTab } from "../components/settings/profile-tab";
import { SecurityTab } from "../components/settings/security-tab";
import { NotificationsTab } from "../components/settings/notifications-tab";
import { PrivacyTab } from "../components/settings/privacy-tab";
import { DangerZone } from "../components/settings/danger-zone";
import { User, Shield, Bell, Globe, ArrowLeft  } from "lucide-react";


interface User {
  id: string;
  nome: string;
  email: string;
  foto: string;
  tipo_usuario: string;
}

export default function Settings() {
  const { darkMode } = useTheme();
  const navigate = useNavigate(); 
  
  const [activeTab, setActiveTab] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const [user, setUser] = useState<User>({
    id: "1",
    nome: "João Silva",
    email: "joao.silva@example.com",
    foto: "https://ui-avatars.com/api/?name=Joao+Silva&background=4F46E5&color=fff",
    tipo_usuario: "administrador",
  });

  const [profileForm, setProfileForm] = useState({
    nome: user.nome,
    email: user.email,
    foto: user.foto,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const [preferences, setPreferences] = useState({
    email_notifications: true,
    device_alerts: true,
    schedule_reminders: true,
    system_updates: false,
    public_profile: true,
    show_online_status: false,
    share_activity: false,
  });

  const displayAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleUpdateProfile = () => {
    if (!profileForm.nome || !profileForm.email) {
      displayAlert("Preencha todos os campos obrigatórios!", "error");
      return;
    }
    setUser({ ...user, ...profileForm });
    displayAlert("Perfil atualizado com sucesso!", "success");
  };

  const handleUpdatePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      displayAlert("Preencha todos os campos de senha!", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      displayAlert("As senhas não coincidem!", "error");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      displayAlert("A senha deve ter no mínimo 6 caracteres!", "error");
      return;
    }
    displayAlert("Senha alterada com sucesso!", "success");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
    displayAlert("Preferência atualizada com sucesso!", "success");
  };

  const handleClearAllData = () => {
    if (!window.confirm("ATENÇÃO: Isso irá excluir TODOS os seus dispositivos, grupos e agendamentos. Esta ação não pode ser desfeita. Deseja continuar?")) {
      return;
    }
    const confirmation = window.prompt('Digite "CONFIRMAR" em maiúsculas para prosseguir:');
    if (confirmation !== "CONFIRMAR") {
      displayAlert("Operação cancelada.", "error");
      return;
    }
    displayAlert("Todos os dados foram limpos com sucesso!", "success");
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("ATENÇÃO: Isso irá EXCLUIR SUA CONTA PERMANENTEMENTE. Todos os seus dados serão perdidos. Esta ação não pode ser desfeita. Deseja continuar?")) {
      return;
    }
    const confirmation = window.prompt('Digite "EXCLUIR CONTA" em maiúsculas para prosseguir:');
    if (confirmation !== "EXCLUIR CONTA") {
      displayAlert("Operação cancelada.", "error");
      return;
    }
    displayAlert("Conta excluída com sucesso! Redirecionando...", "success");
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 2000);
  };

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

const tabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "security", label: "Segurança", icon: Shield },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "privacy", label: "Privacidade", icon: Globe },
];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <BackgroundBlobs darkMode={darkMode} />

      {/* Header */}
      <Header 
        darkMode={darkMode} 
        onLogout={() => handleLogout()}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        {showAlert && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 animate-slide-down ${alertType === "success" ? (darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800") : (darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800")}`}>
            <span className="text-2xl">{alertType === "success" ? "✓" : "✕"}</span>
            <span className="font-medium">{alertMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className={`lg:col-span-1 ${darkMode ? "bg-gray-800/80" : "bg-white/80"} backdrop-blur-sm rounded-2xl shadow-xl p-6`}>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img src={user.foto} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-blue-500" />
                <button className="absolute bottom-2 right-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" onClick={() => displayAlert("Funcionalidade de upload em desenvolvimento", "success")}>
                  📷
                </button>
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>{user.nome}</h2>
              <p className={`text-sm capitalize ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{user.tipo_usuario}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${activeTab === tab.id ? (darkMode ? "bg-blue-600 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white") : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")}`}>
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <div className={`my-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>
              <button onClick={handleBackToDashboard} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <ProfileTab
                profileForm={profileForm}
                userType={user.tipo_usuario}
                onUpdateProfile={handleUpdateProfile}
                onFormChange={setProfileForm}
              />
            )}
            

            {/* Security Tab */}
            {activeTab === "security" && (
              <SecurityTab
                passwordForm={passwordForm}
                onUpdatePassword={handleUpdatePassword}
                onFormChange={setPasswordForm}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <NotificationsTab
                preferences={preferences}
                onPreferenceChange={handlePreferenceChange}
              />
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <Tab>
                <PrivacyTab
                  preferences={preferences}
                  onPreferenceChange={handlePreferenceChange}
                />

                {/* Danger Zone */}
                <DangerZone
                  onClearAllData={handleClearAllData}
                  onDeleteAccount={handleDeleteAccount}
                />
              </Tab>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}