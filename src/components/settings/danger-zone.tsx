import { useTheme } from '../theme-context';
import type { ComponentProps } from 'react';

interface DangerZoneProps extends ComponentProps<"div"> {
  darkMode?: boolean;
  onClearAllData?: () => void;
  onDeleteAccount?: () => void;
  title?: string;
  description?: string;
  clearDataLabel?: string;
  deleteAccountLabel?: string;
}

export function DangerZone(props: DangerZoneProps) {
  const { 
    className,
    darkMode: darkModeProp,
    onClearAllData,
    onDeleteAccount,
    title = "Zona de Perigo",
    description = "Essas ações são irreversíveis. Tenha certeza antes de prosseguir.",
    clearDataLabel = "Limpar Todos os Dados",
    deleteAccountLabel = "Excluir Conta",
    ...rest 
  } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = `p-6 rounded-lg border-2 ${
    darkMode 
      ? "bg-red-900/20 border-red-800" 
      : "bg-red-50 border-red-200"
  }`;

  return (
    <div
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <h4 className={`text-xl font-bold mb-2 flex items-center space-x-2 ${
        darkMode ? "text-red-400" : "text-red-600"
      }`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>{title}</span>
      </h4>
      
      <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {onClearAllData && (
          <button 
            onClick={onClearAllData}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{clearDataLabel}</span>
          </button>
        )}
        
        {onDeleteAccount && (
          <button 
            onClick={onDeleteAccount}
            className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{deleteAccountLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}