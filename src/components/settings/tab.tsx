import { useTheme } from '../theme/theme-context';
import type { ComponentProps } from 'react';

interface TabProps extends ComponentProps<"div"> {
  darkMode?: boolean;
}

export function Tab(props: TabProps) {
  const { className, darkMode: darkModeProp, children, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = `backdrop-blur-sm rounded-2xl shadow-xl p-6 ${
    darkMode
      ? "bg-gray-800/80"
      : "bg-white/80"
  }`;

  return (
    <div
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}