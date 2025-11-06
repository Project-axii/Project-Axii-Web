import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTheme } from "../components/ThemeContext";
import { Tab } from "../components/settings/tab";
import { Label } from "../components/settings/label";

interface User {
  id: string;
  nome: string;
  email: string;
  foto: string;
  tipo_usuario: string;
}

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
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

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
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
    if (!window.confirm("⚠️ ATENÇÃO: Isso irá excluir TODOS os seus dispositivos, grupos e agendamentos. Esta ação não pode ser desfeita. Deseja continuar?")) {
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
    if (!window.confirm("⚠️ ATENÇÃO: Isso irá EXCLUIR SUA CONTA PERMANENTEMENTE. Todos os seus dados serão perdidos. Esta ação não pode ser desfeita. Deseja continuar?")) {
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
    { id: "profile", label: "Perfil", icon: "👤" },
    { id: "security", label: "Segurança", icon: "🛡️" },
    { id: "notifications", label: "Notificações", icon: "🔔" },
    { id: "privacy", label: "Privacidade", icon: "🌐" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${darkMode ? "bg-blue-500" : "bg-blue-400"}`} style={{ top: "-10%", left: "-10%", animationDelay: "0s" }}></div>
        <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${darkMode ? "bg-purple-500" : "bg-purple-400"}`} style={{ bottom: "-10%", right: "-10%", animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <header className={`relative z-10 ${darkMode ? "bg-gray-800/80" : "bg-white/80"} backdrop-blur-sm shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>AXII - Configurações</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={toggleDarkMode} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${darkMode ? "bg-gray-700 text-yellow-400" : "bg-gray-100 text-gray-700"}`}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button onClick={handleLogout} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${darkMode ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"} shadow-lg transform hover:scale-[1.02]`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${activeTab === tab.id ? (darkMode ? "bg-blue-600 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white") : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")}`}>
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
              <div className={`my-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>
              <button onClick={handleBackToDashboard} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
                <span className="text-xl">↩️</span>
                <span>Voltar</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Tab>
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Informações Pessoais</h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Atualize suas informações pessoais e de contato.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo</Label>
                      <input type="text" value={profileForm.nome} onChange={(e) => setProfileForm({ ...profileForm, nome: e.target.value })} className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"}`} />
                    </div>
                    <div>
                      <Label>Tipo de Usuário</Label>
                      <input type="text" value={user.tipo_usuario} className={`w-full px-4 py-3 rounded-lg border capitalize ${darkMode ? "bg-gray-700/50 border-gray-600 text-gray-400" : "bg-gray-100 border-gray-300 text-gray-600"}`} disabled />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"}`} />
                  </div>
                  <div>
                    <Label>URL da Foto (opcional)</Label>
                    <input type="url" value={profileForm.foto} onChange={(e) => setProfileForm({ ...profileForm, foto: e.target.value })} placeholder="https://exemplo.com/foto.jpg" className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500" : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"}`} />
                  </div>
                  <button onClick={handleUpdateProfile} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg transform hover:scale-[1.02] ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"}`}>Salvar Alterações</button>
                </div>
              </Tab>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <Tab>
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Alterar Senha</h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Mantenha sua conta segura com uma senha forte.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: "current", label: "Senha Atual", value: passwordForm.currentPassword, field: "currentPassword" },
                    { key: "new", label: "Nova Senha", value: passwordForm.newPassword, field: "newPassword" },
                    { key: "confirm", label: "Confirmar Nova Senha", value: passwordForm.confirmPassword, field: "confirmPassword" }
                  ].map((item) => (
                    <div key={item.key}>
                      <Label>{item.label}</Label>
                      <div className="relative">
                        <input 
                          type={showPassword[item.key as keyof typeof showPassword] ? "text" : "password"} 
                          value={item.value} 
                          onChange={(e) => setPasswordForm({ ...passwordForm, [item.field]: e.target.value })} 
                          className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"}`} 
                        />
                        <button 
                          onClick={() => setShowPassword({ ...showPassword, [item.key]: !showPassword[item.key as keyof typeof showPassword] })} 
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}
                        >
                          {showPassword[item.key as keyof typeof showPassword] ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleUpdatePassword} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg transform hover:scale-[1.02] ${darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"}`}>Alterar Senha</button>
                </div>
              </Tab>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Tab>
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Preferências de Notificação</h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Escolha como e quando você quer receber notificações.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: "email_notifications", title: "Notificações por Email", desc: "Receba atualizações importantes por email" },
                    { key: "device_alerts", title: "Alertas de Dispositivos", desc: "Notificações quando dispositivos ficam offline" },
                    { key: "schedule_reminders", title: "Agendamentos", desc: "Lembretes sobre agendamentos próximos" },
                    { key: "system_updates", title: "Atualizações do Sistema", desc: "Notificações sobre novas funcionalidades" },
                  ].map((item) => (
                    <div key={item.key} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{item.title}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={preferences[item.key as keyof typeof preferences]} onChange={() => handlePreferenceChange(item.key as keyof typeof preferences)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Tab>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <Tab>
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Configurações de Privacidade</h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Controle suas informações e atividades no sistema.</p>
                </div>
                <div className="space-y-4 mb-8">
                  {[
                    { key: "public_profile", title: "Perfil Público", desc: "Permitir que outros usuários vejam seu perfil" },
                    { key: "show_online_status", title: "Mostrar Status Online", desc: "Exibir quando você está conectado" },
                    { key: "share_activity", title: "Compartilhar Logs de Atividade", desc: "Permitir acesso aos seus logs de sistema" },
                  ].map((item) => (
                    <div key={item.key} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{item.title}</p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={preferences[item.key as keyof typeof preferences]} onChange={() => handlePreferenceChange(item.key as keyof typeof preferences)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Danger Zone */}
                <div className={`p-6 rounded-lg border-2 ${darkMode ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}>
                  <h4 className={`text-xl font-bold mb-2 flex items-center space-x-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>
                    <span>⚠️</span>
                    <span>Zona de Perigo</span>
                  </h4>
                  <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Essas ações são irreversíveis. Tenha certeza antes de prosseguir.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleClearAllData} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>🗑️</span>
                      <span>Limpar Todos os Dados</span>
                    </button>
                    <button onClick={handleDeleteAccount} className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>👤</span>
                      <span>Excluir Conta</span>
                    </button>
                  </div>
                </div>
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