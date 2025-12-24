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

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  feedback: string[];
}

interface SecurityTabProps {
  darkMode?: boolean;

  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  onFormChange: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >;

  onUpdatePassword: (profileData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export function SecurityTab(props: SecurityTabProps) {
  const { darkMode: darkModeProp,} = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;

  const apiUrl = useApiUrl();
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [showStrengthIndicator, setShowStrengthIndicator] = useState(false);

  useEffect(() => {
    if (passwordForm.newPassword.length > 0) {
      validatePasswordStrength(passwordForm.newPassword);
      setShowStrengthIndicator(true);
    } else {
      setShowStrengthIndicator(false);
      setPasswordStrength(null);
    }
  }, [passwordForm.newPassword]);

  const validatePasswordStrength = async (password: string) => {
    try {
      const response = await fetch(`${apiUrl}/tcc-axii/Project-axii-api/api/user/validate_password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setPasswordStrength(data.strength);
      }
    } catch (error) {
      console.error('Erro ao validar senha:', error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Todos os campos são obrigatórios' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'A nova senha e a confirmação não conferem' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres' });
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setMessage({ type: 'error', text: 'A nova senha deve ser diferente da senha atual' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const userId = sessionStorage.getItem('userId') || 
                     JSON.parse(sessionStorage.getItem('user') || '{}').id;

      const response = await fetch(`${apiUrl}/tcc-axii/Project-axii-api/api/user/update_password.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          id: userId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: data.message || 'Senha alterada com sucesso!' 
        });
        
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Erro ao alterar senha' 
        });
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erro ao conectar com o servidor' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'strong':
        return darkMode ? 'bg-green-500' : 'bg-green-600';
      case 'medium':
        return darkMode ? 'bg-yellow-500' : 'bg-yellow-600';
      case 'weak':
        return darkMode ? 'bg-red-500' : 'bg-red-600';
      default:
        return 'bg-gray-400';
    }
  };

  const getStrengthLabel = (level: string) => {
    switch (level) {
      case 'strong':
        return 'Forte';
      case 'medium':
        return 'Média';
      case 'weak':
        return 'Fraca';
      default:
        return '';
    }
  };

  const passwordFields = [
    { 
      key: "current" as const, 
      label: "Senha Atual", 
      value: passwordForm.currentPassword, 
      field: "currentPassword" as const
    },
    { 
      key: "new" as const, 
      label: "Nova Senha", 
      value: passwordForm.newPassword, 
      field: "newPassword" as const
    },
    { 
      key: "confirm" as const, 
      label: "Confirmar Nova Senha", 
      value: passwordForm.confirmPassword, 
      field: "confirmPassword" as const
    }
  ];

  return (
    <Tab darkMode={darkMode}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Alterar Senha
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Mantenha sua conta segura com uma senha forte.
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
        {passwordFields.map((item) => (
          <div key={item.key}>
            <Label darkMode={darkMode}>{item.label}</Label>
            <div className="relative">
              <input 
                type={showPassword[item.key] ? "text" : "password"} 
                value={item.value} 
                onChange={(e) => setPasswordForm({ 
                  ...passwordForm, 
                  [item.field]: e.target.value 
                })} 
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`}
                placeholder={`Digite ${item.label.toLowerCase()}`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword({ 
                  ...showPassword, 
                  [item.key]: !showPassword[item.key] 
                })} 
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  darkMode 
                    ? "text-gray-400 hover:text-gray-300" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-label={showPassword[item.key] ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword[item.key] ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>

            {/* Indicador de força da senha */}
            {item.key === 'new' && showStrengthIndicator && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength.level)}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {getStrengthLabel(passwordStrength.level)}
                  </span>
                </div>
                <ul className={`text-xs space-y-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {passwordStrength.feedback.slice(0, 3).map((feedback, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className={feedback.includes('Contém') || feedback.includes('adequado') ? 'text-green-500' : 'text-yellow-500'}>
                        {feedback.includes('Contém') || feedback.includes('adequado') ? '✓' : '○'}
                      </span>
                      {feedback}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {/* Dicas de segurança */}
        <div className={`mt-4 p-4 rounded-lg ${
          darkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-200"
        }`}>
          <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
            darkMode ? "text-blue-400" : "text-blue-800"
          }`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Dicas para uma senha forte
          </h4>
          <ul className={`text-xs space-y-1 ${
            darkMode ? "text-blue-300" : "text-blue-700"
          }`}>
            <li>• Use pelo menos 8 caracteres</li>
            <li>• Combine letras maiúsculas e minúsculas</li>
            <li>• Inclua números e caracteres especiais</li>
            <li>• Evite informações pessoais óbvias</li>
          </ul>
        </div>
        
        <button 
          onClick={handleUpdatePassword}
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
              Alterando...
            </span>
          ) : (
            'Alterar Senha'
          )}
        </button>
      </div>
    </Tab>
  );
}