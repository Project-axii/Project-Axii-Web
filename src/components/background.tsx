import { useTheme } from './theme/theme-context';
import type { ComponentProps } from 'react';

interface BackgroundBlobsProps extends ComponentProps<"div"> {
  darkMode?: boolean;
}

export function BackgroundBlobs(props: BackgroundBlobsProps) {
  const { className, darkMode: darkModeProp, ...rest } = props;
  const { darkMode: darkModeContext } = useTheme();
  
  const darkMode = darkModeProp ?? darkModeContext;
  
  const baseClass = "absolute inset-0 overflow-hidden pointer-events-none";

  return (
    <div
      {...rest}
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <div 
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
          darkMode ? "bg-blue-500" : "bg-blue-400"
        }`} 
        style={{ top: "-10%", left: "-10%", animationDelay: "0s" }}
      ></div>
      <div 
        className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
          darkMode ? "bg-purple-500" : "bg-purple-400"
        }`} 
        style={{ bottom: "-10%", right: "-10%", animationDelay: "2s" }}
      ></div>
    </div>
  );
}