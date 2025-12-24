import { useState, useEffect } from 'react';
import { useApiUrl } from '../hooks/api';  

const useTheme = () => ({ darkMode: false });

interface ComponentProps {
  darkMode?: boolean;
}

function Tab(props: ComponentProps & { children: React.ReactNode }) {
  const { darkMode, children } = props;
  return (
    <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
      {children}
    </div>
  );
}

function DashInput(props: ComponentProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, darkMode, ...rest } = props;
  const baseClass = `w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
    darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`;
  
  return (
    <input
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    />
  );
}

function Label(props: ComponentProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, darkMode, children, ...rest } = props;
  
  const baseClass = `block mb-2 text-sm font-medium ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;

  return (
    <label
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </label>
  );
}

interface UserData {
  id: string;
  nome: string;
  email: string;
  tipo_usuario?: string;
}

interface ProfileTabProps {
  darkMode?: boolean;
  onUpdateProfile: (profileData: { nome: string; email: string }) => void;
}

export function ProfileTab(props: ProfileTabProps) {
  const { darkMode: darkModeProp,} = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const API_URL = useApiUrl();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileForm, setProfileForm] = useState({
    nome: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Tentar carregar do estado em memória primeiro
        const userString = localStorage.getItem('user');
        
        if (userString) {
          const user: UserData = JSON.parse(userString);
          setUserData(user);
          setProfileForm({
            nome: user.nome || '',
            email: user.email || '',
          });
          setIsFetching(false);
          return;
        }

        const userId = sessionStorage.getItem('id');
        
        if (userId) {
          const response = await fetch(`${API_URL}/tcc-axii/Project-axii-api/api/user/get_profile.php?id=${userId}`);
          const data = await response.json();
          
          if (data.success) {
            setUserData(data.user);
            setProfileForm({
              nome: data.user.nome || '',
              email: data.user.email || '',
            });
            sessionStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil' });
      } finally {
        setIsFetching(false);
      }
    };

    loadUserData();
  }, [API_URL]);

  const handleUpdateProfile = async () => {
    if (!profileForm.nome.trim() || !profileForm.email.trim()) {
      setMessage({ type: 'error', text: 'Nome e e-mail são obrigatórios' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      setMessage({ type: 'error', text: 'E-mail inválido' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/tcc-axii/Project-axii-api/api/user/update_profile.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          id: userData?.id,
          nome: profileForm.nome,
          email: profileForm.email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserData(data.user);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage({ type: 'success', text: data.message || 'Perfil atualizado com sucesso!' });
        
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Erro ao atualizar perfil' 
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao conectar com o servidor' 
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isFetching) {
    return (
      <Tab darkMode={darkMode}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Tab>
    );
  }

  return (
    <Tab darkMode={darkMode}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Informações Pessoais
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Atualize suas informações pessoais e de contato.
        </p>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? darkMode
                ? "bg-green-900/30 text-green-400"
                : "bg-green-50 text-green-700"
              : darkMode
              ? "bg-red-900/30 text-red-400"
              : "bg-red-50 text-red-700"
          }`}
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {message.type === 'success' ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            )}
          </svg>
          <span>{message.text}</span>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label darkMode={darkMode}>Nome Completo</Label>
            <DashInput
              type="text"
              value={profileForm.nome}
              onChange={(e) => setProfileForm({ ...profileForm, nome: e.target.value })}
              darkMode={darkMode}
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div>
            <Label darkMode={darkMode}>Tipo de Usuário</Label>
            <DashInput
              type="text"
              value={getUserTypeLabel(userData?.tipo_usuario)}
              disabled
              darkMode={darkMode}
            />
          </div>
        </div>
        
        <div>
          <Label darkMode={darkMode}>Email</Label>
          <DashInput
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            darkMode={darkMode}
            placeholder="seu@email.com"
          />
        </div>
        
        <button
          onClick={handleUpdateProfile}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg transform hover:scale-[1.02] ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Salvando...
            </span>
          ) : (
            'Salvar Alterações'
          )}
        </button>
      </div>

      {/* Informações adicionais */}
      <div className={`mt-6 pt-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <strong>ID do Usuário:</strong> {userData?.id || 'N/A'}
        </p>
      </div>
    </Tab>
  );
}