import { useTheme } from '../ThemeContext';
import { Tab } from './tab';
import type { ComponentProps } from 'react';

interface ToggleSwitchProps extends Omit<ComponentProps<"input">, 'type'> {
  darkMode?: boolean;
}

function ToggleSwitch(props: ToggleSwitchProps) {
  const { darkMode: darkModeProp, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        {...rest}
      />
      <div className={`w-11 h-6 rounded-full peer transition-colors
        peer-focus:outline-none peer-focus:ring-4 
        ${darkMode 
          ? "bg-gray-600 peer-focus:ring-blue-800 peer-checked:bg-blue-600" 
          : "bg-gray-200 peer-focus:ring-blue-300 peer-checked:bg-blue-600"
        }
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all`}
      ></div>
    </label>
  );
}

interface PrivacyPreferences {
  public_profile: boolean;
  show_online_status: boolean;
  share_activity: boolean;
}

interface PrivacyTabProps {
  darkMode?: boolean;
  preferences: PrivacyPreferences;
  onPreferenceChange: (key: keyof PrivacyPreferences) => void;
  children?: React.ReactNode;
}

export function PrivacyTab(props: PrivacyTabProps) {
  const { 
    darkMode: darkModeProp,
    preferences,
    onPreferenceChange,
    children
  } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;

  const privacyItems = [
    { 
      key: "public_profile" as const, 
      title: "Perfil Público", 
      desc: "Permitir que outros usuários vejam seu perfil" 
    },
    { 
      key: "show_online_status" as const, 
      title: "Mostrar Status Online", 
      desc: "Exibir quando você está conectado" 
    },
    { 
      key: "share_activity" as const, 
      title: "Compartilhar Logs de Atividade", 
      desc: "Permitir acesso aos seus logs de sistema" 
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Configurações de Privacidade
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Controle suas informações e atividades no sistema.
        </p>
      </div>
      
      <div className="space-y-4 mb-8">
        {privacyItems.map((item) => (
          <div 
            key={item.key} 
            className={`flex items-center justify-between p-4 rounded-lg ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div>
              <p className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                {item.title}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {item.desc}
              </p>
            </div>
            
            <ToggleSwitch
              checked={preferences[item.key]}
              onChange={() => onPreferenceChange(item.key)}
              darkMode={darkMode}
              aria-label={`Alternar ${item.title}`}
            />
          </div>
        ))}
      </div>
      
      {children}
    </>
  );
}