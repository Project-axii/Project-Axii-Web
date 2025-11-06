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

interface NotificationPreferences {
  email_notifications: boolean;
  device_alerts: boolean;
  schedule_reminders: boolean;
  system_updates: boolean;
}

interface NotificationsTabProps {
  darkMode?: boolean;
  preferences: NotificationPreferences;
  onPreferenceChange: (key: keyof NotificationPreferences) => void;
}

export function NotificationsTab(props: NotificationsTabProps) {
  const { 
    darkMode: darkModeProp,
    preferences,
    onPreferenceChange
  } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;

  const notificationItems = [
    { 
      key: "email_notifications" as const, 
      title: "Notificações por Email", 
      desc: "Receba atualizações importantes por email" 
    },
    { 
      key: "device_alerts" as const, 
      title: "Alertas de Dispositivos", 
      desc: "Notificações quando dispositivos ficam offline" 
    },
    { 
      key: "schedule_reminders" as const, 
      title: "Agendamentos", 
      desc: "Lembretes sobre agendamentos próximos" 
    },
    { 
      key: "system_updates" as const, 
      title: "Atualizações do Sistema", 
      desc: "Notificações sobre novas funcionalidades" 
    },
  ];

  return (
    <Tab darkMode={darkMode}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Preferências de Notificação
        </h3>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Escolha como e quando você quer receber notificações.
        </p>
      </div>
      
      <div className="space-y-4">
        {notificationItems.map((item) => (
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
    </Tab>
  );
}