import { useState, useEffect, useRef } from "react";
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
import { User, Shield, Bell, Globe, ArrowLeft, Camera } from "lucide-react";
import { useApiUrl } from "../components/hooks/api";

interface UserData {
  id: string;
  nome: string;
  email: string;
  tipo_usuario?: string;
  profile_image?: string;
  foto?: string;
}

export default function Settings() {
  const { darkMode } = useTheme();
  const navigate = useNavigate(); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = useApiUrl();

  const [activeTab, setActiveTab] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user: UserData = JSON.parse(userString);
        setUserData(user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        displayAlert("Erro ao carregar dados do usuário", "error");
      }
    } else {
      displayAlert("Usuário não encontrado. Faça login novamente.", "error");
      setTimeout(() => {
        handleLogout();
      }, 2000);
    }
  }, []);

  const displayAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      displayAlert("Tipo de arquivo não permitido. Use apenas JPG, PNG ou WEBP", "error");
      return;
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      displayAlert("O arquivo é muito grande. O tamanho máximo é 5MB", "error");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const formData = new FormData();
      formData.append('photo', file);

      // CORREÇÃO: Remover o Content-Type do headers
      // O navegador vai definir automaticamente como multipart/form-data
      const response = await fetch(`${API_URL}/tcc-axii/Project-Axii-api/api/user/update_photo.php`, {
        method: 'POST',
        headers: {
          "ngrok-skip-browser-warning": "true",
          'Authorization': `Bearer ${token}`,
          // NÃO inclua Content-Type aqui - deixe o browser definir automaticamente
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar dados do usuário no localStorage e state
        const updatedUser = {
          ...userData!,
          foto: data.photo_url,
          profile_image: data.photo_url
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        
        displayAlert("Foto atualizada com sucesso!", "success");
      } else {
        throw new Error(data.message || 'Erro ao fazer upload');
      }

    } catch (error: any) {
      console.error('Erro no upload:', error);
      displayAlert(error.message || "Erro ao fazer upload da foto", "error");
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateProfile = (profileData: { nome: string; email: string}) => {
    if (!profileData.nome || !profileData.email) {
      displayAlert("Preencha todos os campos obrigatórios!", "error");
      return;
    }

    const updatedUser: UserData = {
      ...userData!,
      nome: profileData.nome,
      email: profileData.email,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUserData(updatedUser);
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
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, 2000);
  };

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const getUserTypeLabel = (type?: string) => {
    if (!type) return 'Usuário';
    
    const types: Record<string, string> = {
      'admin': 'Administrador',
      'professor': 'Professor',
      'gestor': 'Gestor',
    };
    
    return types[type.toLowerCase()] || type;
  };

  const getUserInitials = (nome?: string) => {
    if (!nome || typeof nome !== 'string') return 'U';
    const trimmedName = nome.trim();
    if (!trimmedName) return 'U';
    
    const names = trimmedName.split(' ').filter(n => n.length > 0);
    if (names.length === 0) return 'U';
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getProfileImage = () => {
    if (userData?.foto) {
      return userData.foto;
    }
    if (userData?.profile_image) {
      return userData.profile_image;
    }
    const initials = getUserInitials(userData?.nome);
    return `https://ui-avatars.com/api/?name=${initials}&background=155dfc&color=fff&size=128`;
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "notifications", label: "Notificações", icon: Bell },
    { id: "privacy", label: "Privacidade", icon: Globe },
  ];

  if (!userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      <BackgroundBlobs darkMode={darkMode} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Header */}
      <Header 
        darkMode={darkMode} 
        onLogout={handleLogout}
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
                <img 
                  src={getProfileImage()} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-blue-500 object-cover" 
                  onError={(e) => {
                    const initials = getUserInitials(userData?.nome);
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${initials}&background=4F46E5&color=fff&size=128`;
                  }}
                />
                <button 
                  className="absolute bottom-2 right-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  onClick={handleImageUpload}
                  disabled={uploading}
                  title="Fazer upload de foto"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {userData.nome}
              </h2>
              <p className={`text-sm capitalize ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {getUserTypeLabel(userData.tipo_usuario)}
              </p>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === tab.id 
                        ? (darkMode ? "bg-blue-600 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white") 
                        : (darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              <div className={`my-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>
              <button 
                onClick={handleBackToDashboard} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                  darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
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
                darkMode={darkMode}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <SecurityTab
                darkMode={darkMode}
                passwordForm={passwordForm}
                onUpdatePassword={handleUpdatePassword}
                onFormChange={setPasswordForm}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <NotificationsTab
                darkMode={darkMode}
                preferences={preferences}
                onPreferenceChange={handlePreferenceChange}
              />
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <Tab>
                <PrivacyTab
                  darkMode={darkMode}
                  preferences={preferences}
                  onPreferenceChange={handlePreferenceChange}
                />

                {/* Danger Zone */}
                <DangerZone
                  darkMode={darkMode}
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