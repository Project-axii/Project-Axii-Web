import { useTheme } from '../theme/theme-context';
import { Tab } from './tab';
import { DashInput } from '../home/input';
import type { ComponentProps } from 'react';

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

interface ProfileFormData {
  nome: string;
  email: string;
  foto: string;
}

interface ProfileTabProps {
  darkMode?: boolean;
  profileForm: ProfileFormData;
  userType: string;
  onUpdateProfile: () => void;
  onFormChange: (form: ProfileFormData) => void;
}

export function ProfileTab(props: ProfileTabProps) {
  const { 
    darkMode: darkModeProp,
    profileForm,
    userType,
    onUpdateProfile,
    onFormChange
  } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;

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
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label darkMode={darkMode}>Nome Completo</Label>
            <DashInput
              type="text"
              value={profileForm.nome}
              onChange={(e) => onFormChange({ ...profileForm, nome: e.target.value })}
              darkMode={darkMode}
            />
          </div>
          
          <div>
            <Label darkMode={darkMode}>Tipo de Usuário</Label>
            <DashInput
              type="text"
              value={userType}
              className="capitalize"
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
            onChange={(e) => onFormChange({ ...profileForm, email: e.target.value })}
            darkMode={darkMode}
          />
        </div>
        
        <div>
          <Label darkMode={darkMode}>URL da Foto (opcional)</Label>
          <DashInput
            type="url"
            value={profileForm.foto}
            onChange={(e) => onFormChange({ ...profileForm, foto: e.target.value })}
            placeholder="https://exemplo.com/foto.jpg"
            darkMode={darkMode}
          />
        </div>
        
        <button
          onClick={onUpdateProfile}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg transform hover:scale-[1.02] ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          }`}
        >
          Salvar Alterações
        </button>
      </div>
    </Tab>
  );
}