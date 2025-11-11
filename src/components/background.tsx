import { useTheme } from './theme/theme-context';
import type { ComponentProps } from 'react';

interface BackgroundBlobsProps extends ComponentProps<"div"> {
  darkMode?: boolean;
}

export function BackgroundBlobs(props: BackgroundBlobsProps) {
  const { className, darkMode: darkModeProp, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = "fixed inset-0 overflow-hidden pointer-events-none";

  return (
    <div
      {...rest}
      className={[
        baseClass, 
        darkMode 
          ? "bg-linear-to-br from-blue-900 via-slate-900 to-purple-900" 
          : "bg-linear-to-br via-slate-100",
        className
      ].filter(Boolean).join(' ')}
    >
    </div>
  );
}