import { useTheme } from '../theme/theme-context';
import { Tab } from './tab';
import { DashInput } from '../home/input';
import type { ComponentProps } from 'react';
import { useState, useEffect } from 'react';

interface LabelProps extends ComponentProps<"label"> {
  darkMode?: boolean;
}

function Label(props: LabelProps) {
  const { className, darkMode: darkModeProp, children, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
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
  profile_image?: string;
}

interface ProfileTabProps {
  darkMode?: boolean;
  onUpdateProfile?: (data: { nome: string; email: string; foto: string }) => void;
}

export function ProfileTab(props: ProfileTabProps) {
  const { 
    darkMode: darkModeProp,
    onUpdateProfile
  } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileForm, setProfileForm] = useState({
    nome: '',
    email: '',
    foto: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user: UserData = JSON.parse(userString);
        setUserData(user);
        setProfileForm({
          nome: user.nome || '',
          email: user.email || '',
          foto: user.profile_image || ''
        });
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      if (onUpdateProfile) {
        onUpdateProfile(profileForm);
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      } else {
        const updatedUser: UserData = {
          ...userData!,
          nome: profileForm.nome,
          email: profileForm.email,
          profile_image: profileForm.foto
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setMessage({ type: 'success', text: 'Perfil atualizado localmente!' });
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
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
        
        <div>
          <Label darkMode={darkMode}>URL da Foto (opcional)</Label>
          <DashInput
            type="url"
            value={profileForm.foto}
            onChange={(e) => setProfileForm({ ...profileForm, foto: e.target.value })}
            placeholder="https://exemplo.com/foto.jpg"
            darkMode={darkMode}
          />
          {profileForm.foto && (
            <div className="mt-3 flex items-center gap-3">
              <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}>
                <img 
                  src={profileForm.foto} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Preview da foto de perfil
              </p>
            </div>
          )}
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
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </Tab>
  );
}