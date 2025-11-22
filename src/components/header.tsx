import { useTheme } from './theme/theme-context';
import type { ComponentProps } from 'react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps extends ComponentProps<"header"> {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onGoToSettings?: () => void;
  onLogout?: () => void;
  title?: string;
  setShowModal?: (value: boolean) => void;
  userImage?: string;
  userName?: string;
  userEmail?: string;
}

export function Header(props: HeaderProps) {
  const { 
    className, 
    darkMode: darkModeProp, 
    onToggleDarkMode,
    onGoToSettings,
    onLogout,
    setShowModal,
    title = "AXII",
    userImage,
    userName = "Usuário",
    userEmail = "usuario@email.com",
    ...rest 
  } = props;
  const { darkMode: darkModeContext, toggleDarkMode: toggleDarkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  const handleToggleDarkMode = onToggleDarkMode ?? toggleDarkModeContext;
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const baseClass = `relative z-50 backdrop-blur-sm shadow-md ${
    darkMode ? "bg-gray-800/80" : "bg-white/80"
  }`;

  return (
    <header
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center`}
            >
              <img src={`${
                darkMode ? "../public/white-logo.svg" : "../public/logo.svg"
              }`} alt="" />
            </div>
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleDarkMode}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                darkMode
                  ? "bg-gray-700 text-yellow-400"
                  : "bg-gray-100 text-gray-700"
              }`}
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {onGoToSettings && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden border-2 ${
                    darkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-label="Menu do usuário"
                >
                  {userImage ? (
                    <img 
                      src={userImage} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                    }`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-xl overflow-hidden z-100 ${
                    darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                  }`}>
                    <div className={`px-4 py-3 border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
                          darkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}>
                          {userImage ? (
                            <img 
                              src={userImage} 
                              alt="Foto de perfil" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-7 h-7 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {userName}
                          </p>
                          <p className={`text-xs truncate ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onGoToSettings?.();
                        }}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Configurações</span>
                      </button>

                      {onLogout && (
                        <>
                          <div className={`my-1 border-t ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`} />
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              onLogout();
                            }}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors ${
                              darkMode
                                ? "text-red-400 hover:bg-gray-700"
                                : "text-red-600 hover:bg-gray-100"
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span>Sair</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {setShowModal && (
              <button
                onClick={() => setShowModal(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                } transform hover:scale-[1.02]`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden md:inline">Adicionar Dispositivo</span>
              </button>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
}