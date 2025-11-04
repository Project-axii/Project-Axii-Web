import type { ComponentProps } from 'react';
import { useTheme } from '../ThemeContext'; 

interface DashSelectProps extends ComponentProps<"select"> {
}

export function DashSelect(props: DashSelectProps) {
  const { className, children, ...rest } = props;
  const { darkMode } = useTheme();
  
  const baseClass = `w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
  }`;

  return (
    <select
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </select>
  );
}