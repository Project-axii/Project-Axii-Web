import { useTheme } from '../theme/theme-context';
import { Tab } from './tab';
import { useState, type ComponentProps } from 'react';

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

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecurityTabProps {
  darkMode?: boolean;
  passwordForm: PasswordFormData;
  onUpdatePassword: () => void;
  onFormChange: (form: PasswordFormData) => void;
}

export function SecurityTab(props: SecurityTabProps) {
  const { 
    darkMode: darkModeProp,
    passwordForm,
    onUpdatePassword,
    onFormChange
  } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

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
      
      <div className="space-y-4">
        {passwordFields.map((item) => (
          <div key={item.key}>
            <Label darkMode={darkMode}>{item.label}</Label>
            <div className="relative">
              <input 
                type={showPassword[item.key] ? "text" : "password"} 
                value={item.value} 
                onChange={(e) => onFormChange({ 
                  ...passwordForm, 
                  [item.field]: e.target.value 
                })} 
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                }`} 
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
          </div>
        ))}
        
        <button 
          onClick={onUpdatePassword} 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg transform hover:scale-[1.02] ${
            darkMode 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          }`}
        >
          Alterar Senha
        </button>
      </div>
    </Tab>
  );
}