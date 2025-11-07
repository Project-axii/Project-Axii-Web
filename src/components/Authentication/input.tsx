import { useTheme } from '../theme/theme-context';
import type { ComponentProps } from 'react';

interface AuthInputProps extends ComponentProps<"input"> {
  darkMode?: boolean;
}

export function AuthInput(props: AuthInputProps) {
  const { className, darkMode: darkModeProp, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = `w-full px-4 py-3 pl-11 pr-11 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
  }`;

  return (
    <input
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    />
  );
}