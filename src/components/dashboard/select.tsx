import { useTheme } from '../theme-context';
import type { ComponentProps } from 'react';

interface DashSelectProps extends ComponentProps<"select"> {
  darkMode?: boolean;
}

export function DashSelect(props: DashSelectProps) {
  const { className, darkMode: darkModeProp, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = `w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 appearance-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
  }`;

  return (
    <div className="relative">
      <select
        {...rest}
        className={[baseClass, className].filter(Boolean).join(' ')}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
