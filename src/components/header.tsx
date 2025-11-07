import { useTheme } from './theme/theme-context';
import type { ComponentProps } from 'react';

interface HeaderProps extends ComponentProps<"header"> {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onGoToSettings?: () => void;
  onLogout?: () => void;
  title?: string;
  setShowModal?: (value: boolean) => void;
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
    ...rest 
  } = props;
  const { darkMode: darkModeContext, toggleDarkMode: toggleDarkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  const handleToggleDarkMode = onToggleDarkMode ?? toggleDarkModeContext;
  
  const baseClass = `relative z-10 backdrop-blur-sm shadow-md ${
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
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                darkMode
                  ? "bg-white"
                  : "bg-white"
              }`}
            >
              <svg className="w-8 h-8" viewBox="0 0 244 177" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.7552 177H0L120.294 2.48715e-05L180.014 87.6449L119.441 177H98.1119L158.259 87.6449L120.294 33.3479L21.7552 177Z" fill="url(#paint0_linear_1_78)"/>
                <path d="M75.0769 177H51.6154L96.1475 113.297L72.2594 112.87L82.7552 97.0507H130.105L75.0769 177Z" fill="url(#paint1_linear_1_78)"/>
                <path d="M185.133 92.7754L173.615 110.304L220.965 177H244L185.133 92.7754Z" fill="url(#paint2_linear_1_78)"/>
                <path d="M184.28 81.6594L173.615 66.6957L222.245 0L231.203 17.1014L184.28 81.6594Z" fill="url(#paint3_linear_1_78)"/>
                <defs>
                <linearGradient id="paint0_linear_1_78" x1="187.207" y1="-4.81631" x2="57.6939" y2="176.785" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0071BC"/>
                <stop offset="0.831731" stop-color="#043556"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_78" x1="187.207" y1="-4.81631" x2="57.6939" y2="176.785" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0071BC"/>
                <stop offset="0.831731" stop-color="#043556"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_78" x1="187.207" y1="-4.81631" x2="57.6939" y2="176.785" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0071BC"/>
                <stop offset="0.831731" stop-color="#043556"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1_78" x1="187.207" y1="-4.81631" x2="57.6939" y2="176.785" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0071BC"/>
                <stop offset="0.831731" stop-color="#043556"/>
                </linearGradient>
                </defs>
              </svg>
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
              <button
                onClick={onGoToSettings}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:text-white"
                    : "bg-gray-100 text-gray-700 hover:text-gray-900"
                }`}
                aria-label="Configurações"
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
              </button>
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

            {onLogout && (
              <button
                onClick={onLogout}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  darkMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                } shadow-lg transform hover:scale-[1.02]`}
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
                <span className="hidden md:inline">Sair</span>
              </button>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
}